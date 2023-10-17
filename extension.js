`use strict`;

import Shell from 'gi://Shell';
import Meta from 'gi://Meta';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as Util from 'resource:///org/gnome/shell/misc/util.js';
import {Workspace} from  'resource:///org/gnome/shell/ui/workspace.js'
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

export default class extends Extension {
	_toggleAlacritty() {
		if (!this.cached_window_actor || !this.cached_window_actor.metaWindow || !this.cached_window_actor.metaWindow.get_workspace) {
			let windows = global.get_window_actors().filter(actor => {
				return actor.metaWindow.get_wm_class() === 'Alacritty';
			});

			// Alacritty has not been launched, launching new instance
			if (!windows.length) {
				Util.trySpawnCommandLine(this.settings.get_string('command'));
				return;
			}

			this.cached_window_actor = windows[0];
		}

		let win = this.cached_window_actor.metaWindow;
		let focusWindow = global.display.focus_window;

		// alacritty is active, hiding
		if (win === focusWindow) {
			win.minimize();
			return;
		}

		// alacritty not active, activating
		let activeWorkspace = global.workspace_manager.get_active_workspace();
		let currentMonitor = activeWorkspace.get_display().get_current_monitor();
		let onCurrentMonitor = win.get_monitor() === currentMonitor;
		if (!win.located_on_workspace(activeWorkspace)) {
			win.change_workspace(activeWorkspace);
			onCurrentMonitor || win.move_to_monitor(currentMonitor);
		} else if (win.minimized && !onCurrentMonitor) {
			win.move_to_monitor(currentMonitor);
		}
		activeWorkspace.activate_with_focus(win, global.get_current_time());
	}

	enable() {
		this.settings = this.getSettings();

		this.bindHotkey()
		this.settings.connect('changed::toggle-key', () => {
			this.bindHotkey()
		});

		// hide alcacritty from workspace overview
		this.hideOnOverview()
		this.settings.connect('changed::hide-on-overview', () => {
			this.hideOnOverview()
		});

		// disable animation when hiding alacritty
		if (Main.wm._shouldAnimateActor) {
			this._shouldAnimateActor_bkp = Main.wm._shouldAnimateActor;
			Main.wm._shouldAnimateActor = (actor, types) => {
				if (actor.metaWindow && actor.metaWindow.get_wm_class() === 'Alacritty') return false;
				return this._shouldAnimateActor_bkp.call(Main.wm, actor, types);
			}
		}
	}

	bindHotkey() {
		Main.wm.removeKeybinding('toggle-key');
		this.cached_window_actor = null;
		let ModeType = Shell.hasOwnProperty('ActionMode') ? Shell.ActionMode : Shell.KeyBindingMode;
		Main.wm.addKeybinding('toggle-key', this.settings, Meta.KeyBindingFlags.NONE, ModeType.NORMAL | ModeType.OVERVIEW, this._toggleAlacritty.bind(this));
	}

	hideOnOverview() {
		if (!Workspace.prototype._isOverviewWindow) {
			return
		}

		if (!this.settings.get_boolean('hide-on-overview')) {
			if (this._isOverviewWindow_bkp) {
				Workspace.prototype._isOverviewWindow = this._isOverviewWindow_bkp;
				this._isOverviewWindow_bkp = null;
			}
			return
		}

		this._isOverviewWindow_bkp = Workspace.prototype._isOverviewWindow;
		Workspace.prototype._isOverviewWindow = (win) => {
			if (win.get_wm_class && win.get_wm_class() === 'Alacritty') return false;
			return this._isOverviewWindow_bkp.call(Workspace, win);
		}
	}

	disable() {
		Main.wm.removeKeybinding('toggle-key');
		this.cached_window_actor = null;
		this.settings = null

		if (this._shouldAnimateActor_bkp) {
			Main.wm._shouldAnimateActor = this._shouldAnimateActor_bkp;
			this._shouldAnimateActor_bkp = null;
		}

		if (this._isOverviewWindow_bkp) {
			Workspace.prototype._isOverviewWindow = this._isOverviewWindow_bkp;
			this._isOverviewWindow_bkp = null;
		}
	}
}

/* exported init */

const Main = imports.ui.main;
const Shell = imports.gi.Shell;
const Meta = imports.gi.Meta;

const Self = imports.misc.extensionUtils.getCurrentExtension();
const Convenience = Self.imports.convenience;
//const config = Self.imports.config;

class Extension {
	constructor() {
		this.settings = Convenience.getSettings();
	}

	_toggleAlacritty() {
		if (!this.cached_window_actor || !this.cached_window_actor.metaWindow || !this.cached_window_actor.metaWindow.get_workspace) {
			let windows = global.get_window_actors().filter(actor => {
				let win = actor.metaWindow;
				return win.get_wm_class() === 'Alacritty';
			});

			// Alacritty has not been launched, launching new instance
			if (!windows.length) {
				imports.misc.util.trySpawnCommandLine('/usr/bin/alacritty');
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
		this.cached_window_actor = null;
		let ModeType = Shell.hasOwnProperty('ActionMode') ? Shell.ActionMode : Shell.KeyBindingMode;
		Main.wm.addKeybinding('toggle-key', this.settings, Meta.KeyBindingFlags.NONE, ModeType.NORMAL | ModeType.OVERVIEW, this._toggleAlacritty.bind(this));

		// disable animation when hiding alacritty
		if (Main.wm._shouldAnimateActor) {
			this._shouldAnimateActor_bkp = Main.wm._shouldAnimateActor;
			Main.wm._shouldAnimateActor = (actor, types) => {
				if (actor.metaWindow.get_wm_class() === 'Alacritty') return false;
				return this._shouldAnimateActor_bkp.call(Main.wm, actor, types);
			}
		}
	}

	disable() {
		Main.wm.removeKeybinding('toggle-key');
		this.cached_window_actor = null;

		if (this._shouldAnimateActor_bkp) {
			Main.wm._shouldAnimateActor = this._shouldAnimateActor_bkp;
			this._shouldAnimateActor_bkp = null;
		}
	}
}

function init() {
	return new Extension();
}

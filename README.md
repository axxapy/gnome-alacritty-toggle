Gnome Alacritty Toggle
----------------------

Simple [gnome-shell](https://wiki.gnome.org/Projects/GnomeShell) (v3.38) extension to toggle [Alacritty](https://github.com/alacritty/alacritty) window.

Works under both `Wayland` and `X11`

Hotkey: `Alt+z`

Installation
------------
[<img src="https://github.com/andyholmes/gnome-shell-extensions-badge/raw/master/get-it-on-ego.png" width=160px>](https://extensions.gnome.org/extension/3942/toggle-alacritty/)

### or manually
```bash
$ git clone https://github.com/axxapy/gnome-alacritty-toggle ~/.local/share/gnome-shell/extensions/toggle-alacritty@itstime.tech
$ gnome-extensions enable toggle-alacritty@itstime.tech
```

Settings
-------------

Show alacritty's window on overview screen:
```bash
$ gsettings --schemadir ~/.local/share/gnome-shell/extensions/toggle-alacritty@itstime.tech/schemas set org.gnome.shell.extensions.toggle-alacritty hide-on-overview false
```

Hide alacritty's window on overview screen (default behavior):
```bash
$ gsettings --schemadir ~/.local/share/gnome-shell/extensions/toggle-alacritty@itstime.tech/schemas set org.gnome.shell.extensions.toggle-alacritty hide-on-overview true
```

Redefine hotkey
```bash
$ gsettings --schemadir ~/.local/share/gnome-shell/extensions/toggle-alacritty@itstime.tech/schemas set org.gnome.shell.extensions.toggle-alacritty toggle-key "['<Alt>Z']"
```

Troubleshooting
---------------
To test if it works, you can launch Alacritty manualy and use this command:
```bash
$ dbus-send --print-reply=literal --type=method_call --dest=org.gnome.Shell /org/gnome/Shell org.gnome.Shell.Eval string:"$(cat <<EOL
  global.get_window_actors().filter(actor => {
      return actor.metaWindow.get_wm_class() === 'Alacritty';
  })
EOL
)"
```

it should output smth like the following:
```
[{"_windowType":0,"_notifyWindowTypeSignalId":57783}]
```

#### Important
Alacritty should be executable by the following path: `/usr/bin/alacritty`

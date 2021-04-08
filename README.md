Gnome Alacritty Toggle
----------------------

Simple [gnome-shell](https://wiki.gnome.org/Projects/GnomeShell) (v3.38) extension to toggle [Alacritty](https://github.com/alacritty/alacritty) window.

Works under both `Wayland` and `X11`

Hotkey: `Alt+z`

Installation
------------
```
$ git clone https://github.com/axxapy/gnome-alacritty-toggle ~/.local/share/gnome-shell/extensions/toggle-alacritty@itstime.tech
```
and enable it in Extensions

Change hotkey
-------------
You can change hotkey in `extension_dir/schemas/org.gnome.shell.extensions.toggle-alacritty.gschema.xml` file and recompile it:
```
$ glib-compile-schemas ./schemas/
```

Troubleshooting
---------------
To test if it works, you can launch Alacritty manualy and use this command:
```
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

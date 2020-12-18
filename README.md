Gnome Alacritty Toggle
----------------------

Simple [gnome-shell](https://wiki.gnome.org/Projects/GnomeShell) (v3.38) extension to toggle [Alacritty](https://github.com/alacritty/alacritty) window.

Works under both `Wayland` and `X11`

Hotkey: `Alt+Z`

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


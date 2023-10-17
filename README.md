# Gnome Alacritty Toggle

Simple [gnome-shell](https://wiki.gnome.org/Projects/GnomeShell) extension to toggle [Alacritty](https://github.com/alacritty/alacritty) window.

Works under both `Wayland` and `X11`

By default this extension will :
- Register the `Alt+z` hotkey to toggle Alacritty's shown/hidden state
- If no terminal is open, it tries to execute `/usr/bin/alacritty`.
- When opening Gnome's overview (`<Super>` key), Alacritty's window will be hidden.

You can configure this behavior by changing settings through [gsettings](#configuration)

## Requirements

- Gnome `45+`: use master branch
- Gnome `3.38..44`: use [Gnome 44 release](https://github.com/axxapy/gnome-alacritty-toggle/releases/tag/v1.44.0)
- [Alacritty](https://github.com/alacritty/alacritty)

## Installation

### Through gnome extensions
[<img src="https://github.com/andyholmes/gnome-shell-extensions-badge/raw/master/get-it-on-ego.png" width=160px>](https://extensions.gnome.org/extension/3942/toggle-alacritty/)

### Manually

Install the extension
```bash
$ git clone https://github.com/axxapy/gnome-alacritty-toggle ~/.local/share/gnome-shell/extensions/toggle-alacritty@itstime.tech
```

On Wayland, logout and login so `gnome-extensions` picks up the newly installed extension.  
On X11, press `Alt+F2`, type `r`, and press enter to reload Gnome.

Then enable the extension :
```bash
$ gnome-extensions enable toggle-alacritty@itstime.tech
```

## Configuration

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

Change alacritty command path
```bash
$ gsettings --schemadir ~/.local/share/gnome-shell/extensions/toggle-alacritty@itstime.tech/schemas set org.gnome.shell.extensions.toggle-alacritty command "$HOME/.local/bin/alacritty"
```

## Troubleshooting

To test if it works, you can launch Alacritty manualy and use this command:
```bash
$ dbus-send --print-reply=literal --type=method_call --dest=org.gnome.Shell /org/gnome/Shell org.gnome.Shell.Eval string:"$(cat <<EOL
  global.get_window_actors().filter(actor => {
      return actor.metaWindow.get_wm_class() === 'Alacritty';
  })
EOL
)"
```

It should output something like the following:
```
[{"_windowType":0,"_notifyWindowTypeSignalId":57783}]
```

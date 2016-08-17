# kodikeys

A simple terminal utility that allows sending key presses to a remote [Kodi](http://kodi.tv/) media center. For example, you could run kodikeys on your laptop as a simple remote control keyboard.

## Features
* Send key presses to Kodi's [EventServer](http://kodi.wiki/view/EventServer)  
* Search and input request prompts using [JSON-RPC](http://kodi.wiki/view/JSON-RPC_API) api  

## Installation
`npm install -g kodikeys`

## Usage

Note: In order to connect remotely to your Kodi host, first go to `Settings > Services > Remote Control` in your Kodi installation and make sure `Allow remote control by programs on other systems` is enabled.

To run:

```
kodikeys kodi-host
```

Replace `kodi-host` with the host name or IP address of your Kodi box.

To view options:

```
kodikeys -h
```

## Known Issues

Keyboard combinations using `ctrl` key do not work, as Kodi's EventServer does not seem to recognize them.

## Resources
[Kodi keyboard reference](http://kodi.wiki/view/Keyboard_controls)  
[Kodi EventServer](http://kodi.wiki/view/EventServer)  
[Kodi JSON-RPC API](http://kodi.wiki/view/JSON-RPC_API)

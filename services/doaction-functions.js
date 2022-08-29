const jsonfile = require('jsonfile');
const applescript = require('applescript');
const path = require('path');

// doActon 999 action set
const start_doAction = (pathJson, res) => {
    console.log('doAction json ', pathJson)
    console.log('result start doAction asset path ', res);
    console.log(`${process.env.APPLESCRIPT_PATH}:${process.env.CPU}:${path.basename(res)}`)

    jsonfile.readFile(pathJson, (err, obj) => {
        if(err) return console.error('json error ', err.message);
        // console.log(obj._999run)
        /* open the asset in Photoshop and run doAction */
        console.log(process.env.PHOTOSHOP)
    var phs = `tell application "${process.env.PHOTOSHOP}"\n\tactivate`;
        phs += `\n\tset psAsset to "${process.env.APPLESCRIPT_PATH}:${process.env.CPU}:${path.basename(res)}"`;        
        phs += '\n\topen alias psAsset\n\tdelay 1';
        // phs += '\n\tdo action "' + obj._999run + '" from "' + obj._999 + '"'; 
        phs += '\nend tell';
    
        applescript.execString(phs, (err, res) => {
            if(err) console.error(err);
            console.log('running PS doAction');
        });
    });
}

const start_triggerAction = (fileJson, actionSet) => {
    console.log(fileJson)
    console.log(actionSet)
    jsonfile.readFile('/Users/Shared/dd_color_engine/04_metadata/' + fileJson, (err, obj) => {
        if(err) return console.error(err.message);

        /* open the asset in Photoshop and run doAction */
        var phs = 'tell application "Adobe Photoshop 2022"\n\tactivate';
            phs += '\n\tdo action "' + obj[actionSet + 'run_Recovery'] + '" from "' + obj[actionSet + '_Recovery'] + '"'; 
            phs += '\nend tell';
    
        applescript.execString(phs, (err, res) => {
        if(err) return console.error(err);
            console.log(res);
        });
    });
}

const setMarker1 = () => {
        /* open the asset in Photoshop and run doAction */
        var phs = 'tell application "Adobe Photoshop 2022"\n\tactivate';
            phs += '\n\tdo action "nodeJS_trigger_is_ON_1" from "0000_000_markers"'; 
            phs += '\nend tell';
    
        applescript.execString(phs, (err, res) => {
        if(err) return console.error(err);
            console.log(res);
        });
}

const setMarker0 = () => {
        /* open the asset in Photoshop and run doAction */
        var phs = 'tell application "Adobe Photoshop 2022"\n\tactivate';
            phs += '\n\tdo action "nodeJS_trigger_is_OFF_0" from "0000_000_markers"'; 
            phs += '\nend tell';
    
        applescript.execString(phs, (err, res) => {
        if(err) return console.error(err);
            console.log(res);
        });
}


exports.start_doAction = start_doAction;
exports.start_triggerAction = start_triggerAction;
exports.setMarker1 = setMarker1;
exports.setMarker0 = setMarker0;

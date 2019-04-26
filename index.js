'use strict';

const AWS = require('aws-sdk');

function startEC2Instance(region, instanceId) {
    const ec2 = new AWS.EC2({ region: region });
    const params = {
        InstanceIds: [instanceId],
        DryRun: false,
    };
    return new Promise((resolve, reject) => {
        ec2.startInstances(params, (err, data) => {
            if (err) reject(err);
            else     resolve(data);
        }); 
    });
}


function stopEC2Instance(region, instanceId) {
    const ec2 = new AWS.EC2({ region: region });
    const params = {
        InstanceIds: [instanceId],
        DryRun: false,
    };
    return new Promise((resolve, reject) => {
        ec2.stopInstances(params, (err, data) => {
            if (err) reject(err);
            else     resolve(data);
        }); 
    });
}

function executeControl(ec2Function) {
    const result = { EC2: null };
    const a = ec2Function(process.env.EC2_REGION, process.env.EC2_INSTANCE_ID)
        .then(data => {
            result.EC2 = { result: 'OK', data: data };
        }).catch(err => {
            result.EC2 = { result: 'hoge', data: err };
        });
    return Promise.all([a]).then(() => result );
}

function getSuccessfulResponse(message, result) {
    return {
        "response_type": "in_channel",
        "attachments": [
            {
                "color": "#32cd32",
                "title": 'Success',
                "text": message,
            },
            {
                "title": 'Result',
                "text": '```' + JSON.stringify(result, null, 2) + '```',
            },
        ],
    };
}

function getErrorResponse(message) {
    return {
        "response_type": "ephemeral",
        "attachments": [
            {
                "color": "#ff0000",
                "title": 'Error',
                "text": message,
            },
        ],
    };
}

exports.handler = (event, context, callback) => {
    if (!event.token || event.token !== process.env.SLASH_COMMAND_TOKEN)
        callback(null, getErrorResponse('Invalid token'));
    if (!event.text)
        callback(null, getErrorResponse('Parameter missing'));
    if (event.text.match(/start/)) {
        executeControl(startEC2Instance)
        .then(result => { callback(null, getSuccessfulResponse('Starting...', result)); });
    } else if (event.text.match(/stop/)) {
        executeControl(stopEC2Instance)
        .then(result => { callback(null, getSuccessfulResponse('Stopping...', result)); });
    } else {
        callback(null, getErrorResponse('Unknown parameters'));
    }
};

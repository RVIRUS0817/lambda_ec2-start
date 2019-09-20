'use strict';

const AWS = require('aws-sdk');
var targetId = '';

// EC2 インスタンスのステータスを確認
function statusEC2Instance(region, instanceId) {
    const ec2 = new AWS.EC2({ region: region });
    const params = {
        InstanceIds: [instanceId],
        DryRun: false
    };
    return new Promise((resolve, reject) => {
        ec2.describeInstances(params, (err, data) => {
            if (err) reject(err);
            else    resolve(data.Reservations[0].Instances[0].State.Name);
        }); 
    });
}

// EC2 インスタンスを起動
function startEC2Instance(region, instanceId) {
    const ec2 = new AWS.EC2({ region: region });
    const params = {
        InstanceIds: [instanceId],
        DryRun: false,
    };
    return new Promise((resolve, reject) => {
        ec2.startInstances(params, (err, data) => {
            if (err) reject(err);
            else     resolve(data.StartingInstances[0].CurrentState.Name);
        }); 
    });
}


// EC2 インスタンスを停止
function stopEC2Instance(region, instanceId) {
    const ec2 = new AWS.EC2({ region: region });
    const params = {
        InstanceIds: [instanceId],
        DryRun: false,
    };
    return new Promise((resolve, reject) => {
        ec2.stopInstances(params, (err, data) => {
            if (err) reject(err);
            else     resolve(data.StoppingInstances[0].CurrentState.Name);
        }); 
    });
}

// 関数指定してインスタンスを制御
function executeControl(ec2Function) {
    //const result = { EC2: null };
    var result = '';
    const a = ec2Function(process.env.EC2_REGION, targetId)
        .then(data => {
            //result = { result: 'OK', data: data };
            result = data;
        }).catch(err => {
            result = { result: 'hoge', data: err };
        });
    return Promise.all([a]).then(() => result );
}

function getSuccessfulResponse(message, result) {
    return {
        //"response_type": "in_channel",
        "attachments": [
            {
                "color": "#32cd32",
                "title": 'Success',
                "text": message,
            },
            {
                "title": 'Result',
                "text": '```' + result + '```',
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

# インスタンスIDの指定
exports.handler = (event, context, callback) => {
    if (!event.token || event.token !== process.env.SLASH_COMMAND_TOKEN)
        callback(null, getErrorResponse('Invalid token'));
    if (!event.text)
        callback(null, getErrorResponse('Parameter missing'));

    var target = event.text.split(' ')[0];
    switch (target) {
        case 'dev1':
            targetId = 'i-xxxxxxxxxxxx';
            break;
        case 'dev2':
            targetId = 'i-xxxxxxxxxxxx';
            break;
    }
    
    if (event.text.match(/start/)) {
        executeControl(startEC2Instance).then(result => { callback(null, getSuccessfulResponse(target + ' Starting...', result)); });
    } else if (event.text.match(/stop/)) {
        executeControl(stopEC2Instance).then(result => { callback(null, getSuccessfulResponse(target + ' Stopping...', result)); });
    } else if (event.text.match(/status/)) {
        executeControl(statusEC2Instance).then(result => { callback(null, getSuccessfulResponse(target + ' Get status...', result)); });
    } else {
        callback(null, getErrorResponse('Unknown parameters'));
    }
};

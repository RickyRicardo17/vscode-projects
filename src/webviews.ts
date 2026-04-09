import * as path from 'path';
import * as vscode from 'vscode';
import {Template} from 'adaptivecards-templating';
import {EvaluationContext} from 'adaptivecards-templating';
import { TeamworkProjectsApi } from './teamworkProjectsApi';
import TaskCard = require('./cards/taskCard.json');
import TaskCardWithTime = require('./cards/taskCardWithTime.json');

/** asWebviewUri / cspSource exist on all supported VS Code runtimes; bundled typings can lag (e.g. older @types). */
type WebviewResourceApi = vscode.Webview & {
    asWebviewUri(localResource: vscode.Uri): vscode.Uri;
    readonly cspSource: string;
};

function webviewResources(webview: vscode.Webview): WebviewResourceApi {
    return webview as WebviewResourceApi;
}

export class WebViews{
    private readonly _extensionPath: string;    
    public readonly _context: vscode.ExtensionContext;
    public API: TeamworkProjectsApi;

    constructor(private context: vscode.ExtensionContext,extensionPath: string, api: TeamworkProjectsApi) {
        this._context = context;
        this._extensionPath = extensionPath;
        this.API = api;
    }

    public GetWebViewContentLoader(webview: vscode.Webview){
        const wv = webviewResources(webview);

        const jqueryUri = wv.asWebviewUri(vscode.Uri.file(path.join(this._extensionPath, 'media/js', 'jquery.min.js')));

        const nonce = this.getNonce();

        const ACStyleUri = wv.asWebviewUri(vscode.Uri.file(path.join(this._extensionPath, 'media/css', 'loader.css')));

        return `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Cat Coding</title>
                    <meta http-equiv="Content-Security-Policy" content="script-src 'nonce-${nonce}' ${wv.cspSource}; style-src ${wv.cspSource} 'unsafe-inline' http: https: data:;">
                    <script nonce="${nonce}" src="${jqueryUri}"></script>
                    <link rel="stylesheet" href="${ACStyleUri}"  nonce="${nonce}"  type="text/css" />
                </head>
                <body style='background:#2D2B2C;height:800px;width:400px;'>
                        <div id="app-loader" class="app-loader" >
                        <svg class="app-loader__-logo" xmlns="http://www.w3.org/2000/svg" width="90" height="90" viewBox="0 0 160 128">
                            <defs>
                                <style>
                                    .cls-1 {
                                        fill: #ffffff;
                                    }
                    
                                    .cls-2 {
                                        fill: #ffffff;
                                    }
                                </style>
                            </defs>
                            <circle class="cls-1" cx="118" cy="86" r="12"></circle>
                            <path class="cls-2" d="M160,48a32,32,0,0,0-32-32H63.59A20.07,20.07,0,0,0,44,0H20A20.06,20.06,0,0,0,0,20V96a32,32,0,0,0,32,32h96a32,32,0,0,0,32-32Zm-32,64H32A16,16,0,0,1,16,96V32H128a16,16,0,0,1,16,16V96A16,16,0,0,1,128,112Z"></path>
                        </svg>
                        <p class="w-app-preloading__installation-name" style='color:#ffffff'>
                            please wait...
                        </p>
                        <div class="app-loader__loading-bar"></div>
                    </div>
                </body>
                </html>`;


    }

    public GetWebViewLogin(webview: vscode.Webview){
        const wv = webviewResources(webview);

        const jqueryUri = wv.asWebviewUri(vscode.Uri.file(path.join(this._extensionPath, 'media/js', 'jquery.min.js')));

        const scriptUri = wv.asWebviewUri(vscode.Uri.file(path.join(this._extensionPath, 'media/js', 'mainTeamwork.js')));

        const nonce = this.getNonce();

        const ACStyleUri = wv.asWebviewUri(vscode.Uri.file(path.join(this._extensionPath, 'media/css', 'loader.css')));

        return `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Cat Coding</title>
                    <meta http-equiv="Content-Security-Policy" content="script-src 'nonce-${nonce}' ${wv.cspSource}; style-src ${wv.cspSource} 'unsafe-inline' http: https: data:;">
                    <script nonce="${nonce}" src="${jqueryUri}"></script>
                    <script nonce="${nonce}" src="${scriptUri}"></script>
                    <link rel="stylesheet" href="${ACStyleUri}"  nonce="${nonce}"  type="text/css" />
                </head>
                <body style='background:#2D2B2C;height:800px;width:400px;'>
                    
                </body>
                </html>`;


    }

    public async GetWebViewContentAdaptiveCard(taskItem: number, webview: vscode.Webview, force: boolean = false)  {
        var todo = await this.API.getTodoItem(this._context, taskItem,force);
        if(todo){
            const wv = webviewResources(webview);
        
            var config = vscode.workspace.getConfiguration('twp');
            var timeTracking = config.get("enabletimeTracking");
            var  _templatePayload: object = timeTracking ? TaskCardWithTime : TaskCard;


             let template = new Template( _templatePayload);
             let context = new EvaluationContext();
             context.$root = todo;
             let expandedTemplatePayload = template.expand(context);

            const scriptUri = wv.asWebviewUri(vscode.Uri.file(path.join(this._extensionPath, 'media/js', 'mainAdaptive.js')));
            
            const jqueryUri = wv.asWebviewUri(vscode.Uri.file(path.join(this._extensionPath, 'media/js', 'jquery.min.js')));

            const FabricUri = wv.asWebviewUri(vscode.Uri.file(path.join(this._extensionPath, 'media/js', 'fabric.min.js')));

            const ACUri = wv.asWebviewUri(vscode.Uri.file(path.join(this._extensionPath, 'media/js', 'adaptivecards.min.js')));

            const ACUFabricUri = wv.asWebviewUri(vscode.Uri.file(path.join(this._extensionPath, 'media/js', 'adaptivecards-fabric.min.js')));

            const ReactUri = wv.asWebviewUri(vscode.Uri.file(path.join(this._extensionPath, 'media/js', 'react.min.js')));

            const ReactDomUri = wv.asWebviewUri(vscode.Uri.file(path.join(this._extensionPath, 'media/js', 'react-dom.min.js')));

            const MarkdownUri = wv.asWebviewUri(vscode.Uri.file(path.join(this._extensionPath, 'media/js', 'markdown-it.min.js')));

            const mainstyleUri = wv.asWebviewUri(vscode.Uri.file(path.join(this._extensionPath, 'media/css', 'msteamsstyle.css')));

            const FabricStyleUri = wv.asWebviewUri(vscode.Uri.file(path.join(this._extensionPath, 'media/css', 'fabric.components.min.css')));

            const ACStyleUri = wv.asWebviewUri(vscode.Uri.file(path.join(this._extensionPath, 'media/css', 'editormain.css')));

            
            const nonce = this.getNonce();

            return `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Cat Coding</title>
                        <meta http-equiv="Content-Security-Policy" content="script-src 'nonce-${nonce}' ${wv.cspSource}; style-src ${wv.cspSource} 'unsafe-inline' http: https: data:;">

                        <link rel="stylesheet" href="${mainstyleUri}"  nonce="${nonce}"  type="text/css" />
                        <link rel="stylesheet" href="${ACStyleUri}"  nonce="${nonce}"  type="text/css" />
                        <link rel="stylesheet" href="${FabricStyleUri}"  nonce="${nonce}"  type="text/css" />
                    </head>
                    <body>
                        <div id="exampleDiv"></div>
                        <div id="out"></div>
                        <script nonce="${nonce}" src="${jqueryUri}"></script>
                        <script nonce="${nonce}" src="${ReactUri}"></script>
                        <script nonce="${nonce}" src="${ReactDomUri}"></script>
  
                        <script nonce="${nonce}" src="${FabricUri}"></script>
                        <script nonce="${nonce}" src="${ACUri}"></script>
                        <script nonce="${nonce}" src="${ACUFabricUri}"></script>
                        

                        <script nonce="${nonce}" src="${MarkdownUri}"></script>
                        <script nonce="${nonce}" src="${scriptUri}"></script>
                        <div id="divData" style='display:none;'>
                            ${JSON.stringify(expandedTemplatePayload)}
                        </div>
                    </body>
                    </html>`;
        }
    }

    public async GetWebViewContentTeamwork(taskItem: number, webview: vscode.Webview, force: boolean = false)  {
        var config = vscode.workspace.getConfiguration('twp');
        var root = config.get("APIRoot");

        var auth = "Basic " + Buffer.from(config.get("APIKey") + ":xxxxxx").toString("base64");

        var todo = await this.API.getTodoItem(this._context, taskItem);

        if(todo){
            const wv = webviewResources(webview);
            const nonce = this.getNonce();

            const scriptUri = wv.asWebviewUri(vscode.Uri.file(path.join(this._extensionPath, 'media/js', 'mainTeamwork.js')));
            
            const jqueryUri = wv.asWebviewUri(vscode.Uri.file(path.join(this._extensionPath, 'media/js', 'jquery.min.js')));
    
    
            return `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Cat Coding</title>
                        <meta http-equiv="Content-Security-Policy" content="script-src 'nonce-${nonce}' ${wv.cspSource}; style-src ${wv.cspSource} 'unsafe-inline' http: https: data:;">
                        <script nonce="${nonce}" src="${jqueryUri}"></script>
                        <script nonce="${nonce}" src="${scriptUri}"></script>
                        <script type="text/javascript" nonce="${nonce}">
                            $(document).ready(function () {
        
                                $.ajax({
                                    url: '${root}' + 'me.json',
                                    headers: {
                                        'Authorization': '${auth}',
                                    },
                                    dataType: 'json',
                                    method: 'GET',
                                    crossDomain: true,
                                    success: function(data) {

                                    },
                                    error: function() {
                                        var frameUrl = '${root}' + '?embeddedView=1#embed?view=viewTask&params=' + encodeURIComponent(JSON.stringify({ taskId: parseInt("${taskItem}") }))
                                        $('#frmTasks').attr('src', frameUrl);
                                    },
                                    xhrFields: {
                                        withCredentials: true
                                    }
                                });
                            });
    
                        </script>
                    </head>
                    <body>
                        <iframe id="frmTasks" allowtransparency="true" frameborder="0" style="display:none;overflow:hidden;height:97%;width:100%" sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-pointer-lock allow-scripts allow-same-origin"></iframe>
                    </body>
                    </html>`;
        }


    }

    private getNonce() {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }


}
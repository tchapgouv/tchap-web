(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{1145:function(e,t){e.exports=function(){throw new Error("define cannot be used indirect")}},404:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=f(a(58)),r=f(a(66)),s=f(a(594)),o=f(a(0)),i=f(a(1)),l=a(2),u=d(a(17)),c=d(a(600)),p=f(a(3));function d(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}function f(e){return e&&e.__esModule?e:{default:e}}t.default=o.default.createClass({displayName:"ExportE2eKeysDialog",propTypes:{matrixClient:i.default.instanceOf(u.MatrixClient).isRequired,onFinished:i.default.func.isRequired},getInitialState:function(){return{phase:1,errStr:null}},componentWillMount:function(){this._unmounted=!1},componentWillUnmount:function(){this._unmounted=!0},_onPassphraseFormSubmit:function(e){e.preventDefault();var t=this.refs.passphrase1.value;return t.length<8?(this.setState({errStr:(0,l._t)("Passphrase must be at least 8 character long")}),!1):t!==this.refs.passphrase2.value?(this.setState({errStr:(0,l._t)("Passphrases must match")}),!1):t?(this._startExport(t),!1):(this.setState({errStr:(0,l._t)("Passphrase must not be empty")}),!1)},_startExport:function(e){var t=this;r.default.resolve().then((function(){return t.props.matrixClient.exportRoomKeys()})).then((function(t){return c.encryptMegolmKeyFile((0,n.default)(t),e)})).then((function(e){var a=new Blob([e],{type:"text/plain;charset=us-ascii"});s.default.saveAs(a,"tchap-keys.txt"),t.props.onFinished(!0)})).catch((function(e){if(console.error("Error exporting e2e keys:",e),!t._unmounted){var a=e.friendlyText||(0,l._t)("Unknown error");t.setState({errStr:a,phase:1})}})),this.setState({errStr:null,phase:2})},_onCancelClick:function(e){return e.preventDefault(),this.props.onFinished(!1),!1},render:function(){var e=p.default.getComponent("views.dialogs.BaseDialog"),t=2===this.state.phase;return o.default.createElement(e,{className:"mx_exportE2eKeysDialog",onFinished:this.props.onFinished,title:(0,l._t)("Export room keys")},o.default.createElement("form",{onSubmit:this._onPassphraseFormSubmit},o.default.createElement("div",{className:"mx_Dialog_content"},o.default.createElement("p",null,(0,l._t)("This process allows you to export the keys for messages you have received in encrypted rooms to a local file. You will then be able to import the file into another Matrix client in the future, so that client will also be able to decrypt these messages.")),o.default.createElement("p",null,(0,l._t)("The exported file will allow anyone who can read it to decrypt any encrypted messages that you can see, so you should be careful to keep it secure. To help with this, you should enter a passphrase below, which will be used to encrypt the exported data. It will only be possible to import the data by using the same passphrase.")),o.default.createElement("div",{className:"error"},this.state.errStr),o.default.createElement("div",{className:"mx_E2eKeysDialog_inputTable"},o.default.createElement("div",{className:"mx_E2eKeysDialog_inputRow"},o.default.createElement("div",{className:"mx_E2eKeysDialog_inputLabel"},o.default.createElement("label",{htmlFor:"passphrase1"},(0,l._t)("Enter passphrase (8 characters minimum)"))),o.default.createElement("div",{className:"mx_E2eKeysDialog_inputCell"},o.default.createElement("input",{ref:"passphrase1",id:"passphrase1",autoFocus:!0,size:"64",type:"password",disabled:t}))),o.default.createElement("div",{className:"mx_E2eKeysDialog_inputRow"},o.default.createElement("div",{className:"mx_E2eKeysDialog_inputLabel"},o.default.createElement("label",{htmlFor:"passphrase2"},(0,l._t)("Confirm passphrase"))),o.default.createElement("div",{className:"mx_E2eKeysDialog_inputCell"},o.default.createElement("input",{ref:"passphrase2",id:"passphrase2",size:"64",type:"password",disabled:t}))))),o.default.createElement("div",{className:"mx_Dialog_buttons"},o.default.createElement("input",{className:"mx_Dialog_primary",type:"submit",value:(0,l._t)("Export"),disabled:t}),o.default.createElement("button",{onClick:this._onCancelClick,disabled:t},(0,l._t)("Cancel")))))}}),e.exports=t.default},594:function(e,t,a){var n,r=r||function(e){"use strict";if(!(void 0===e||"undefined"!=typeof navigator&&/MSIE [1-9]\./.test(navigator.userAgent))){var t=e.document,a=function(){return e.URL||e.webkitURL||e},n=t.createElementNS("http://www.w3.org/1999/xhtml","a"),r="download"in n,s=/constructor/i.test(e.HTMLElement)||e.safari,o=/CriOS\/[\d]+/.test(navigator.userAgent),i=function(t){(e.setImmediate||e.setTimeout)((function(){throw t}),0)},l=function(e){setTimeout((function(){"string"==typeof e?a().revokeObjectURL(e):e.remove()}),4e4)},u=function(e){return/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)?new Blob([String.fromCharCode(65279),e],{type:e.type}):e},c=function(t,c,p){p||(t=u(t));var d,f=this,m="application/octet-stream"===t.type,h=function(){!function(e,t,a){for(var n=(t=[].concat(t)).length;n--;){var r=e["on"+t[n]];if("function"==typeof r)try{r.call(e,a||e)}catch(e){i(e)}}}(f,"writestart progress write writeend".split(" "))};if(f.readyState=f.INIT,r)return d=a().createObjectURL(t),void setTimeout((function(){var e,t;n.href=d,n.download=c,e=n,t=new MouseEvent("click"),e.dispatchEvent(t),h(),l(d),f.readyState=f.DONE}));!function(){if((o||m&&s)&&e.FileReader){var n=new FileReader;return n.onloadend=function(){var t=o?n.result:n.result.replace(/^data:[^;]*;/,"data:attachment/file;");e.open(t,"_blank")||(e.location.href=t),t=void 0,f.readyState=f.DONE,h()},n.readAsDataURL(t),void(f.readyState=f.INIT)}(d||(d=a().createObjectURL(t)),m)?e.location.href=d:e.open(d,"_blank")||(e.location.href=d);f.readyState=f.DONE,h(),l(d)}()},p=c.prototype;return"undefined"!=typeof navigator&&navigator.msSaveOrOpenBlob?function(e,t,a){return t=t||e.name||"download",a||(e=u(e)),navigator.msSaveOrOpenBlob(e,t)}:(p.abort=function(){},p.readyState=p.INIT=0,p.WRITING=1,p.DONE=2,p.error=p.onwritestart=p.onprogress=p.onwrite=p.onabort=p.onerror=p.onwriteend=null,function(e,t,a){return new c(e,t||e.name||"download",a)})}}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||this.content);
/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */e.exports?e.exports.saveAs=r:null!==a(1145)&&null!==a(602)&&(void 0===(n=function(){return r}.call(t,a,t,e))||(e.exports=n))}}]);
//# sourceMappingURL=3.js.map
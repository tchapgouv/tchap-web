import MatrixClientPeg from './MatrixClientPeg';
import SdkConfig from "./SdkConfig";
import TchapApi from './TchapApi';

/**
 * Tchap utils.
 */
class Tchap {

    /**
     * Return a short value for getDomain().
     * @returns {string} The shortened value of getDomain().
     */
    static getShortDomain() {
        const cli = MatrixClientPeg.get();
        const baseDomain = cli.getDomain();
        const domain = baseDomain.split('.tchap.gouv.fr')[0].split('.').reverse().filter(Boolean)[0];

        return this._capitalize(domain) || 'Tchap';
    }

    /**
     * Return a domain name from a room_id.
     * @param {string} id The room_id to analyse.
     * @returns {string} The extracted domain name.
     */
    static getDomainFromId(id) {
        const domain = id.split(':').reverse()[0].split('.tchap.gouv.fr')[0].split('.').filter(Boolean).reverse()[0];

        return this._capitalize(domain) || 'Tchap';
    }

    /**
     * Return a HS from a given email.
     * @param {string} email
     * @returns {Promise}
     */
    static getHSInfoFromEmail(email) {
        const tchapHostsList = this._shuffle(SdkConfig.get()['hs_url_list']);
        const hostBase = TchapApi.hostBase;
        const infoUrl = TchapApi.infoFromEmailUrl;
        return fetch(hostBase + tchapHostsList[0] + infoUrl + email).then(res => {
            return res.json();
        });
    }

    /**
     * Given an email, return the homeserver associated with this email.
     * @param {string} email The email from which we are looking for the server.
     * @returns {Promise}
     */
    static discoverPlatform(email) {
        const hostBase = TchapApi.hostBase;
        const infoUrl = TchapApi.infoFromEmailUrl;
        return new Promise((resolve, reject) => {
            const tchapHostsList = this._shuffle(SdkConfig.get()['hs_url_list']);
            if (tchapHostsList) {
                const promises = tchapHostsList.map(url => this._httpRequest(hostBase + url + infoUrl + email, {}));
                Promise.race(promises).then(data => {
                    let hs = null;
                    let err = null;
                    if (data && data.hs && data.hs !== "" && data.hs !== null) {
                        hs = data.hs;
                    } else if (data && (data.hs === "" || data.hs === null)) {
                        err = ("ERR_UNAUTHORIZED_EMAIL");
                    } else {
                        err = ("ERR_UNREACHABLE_HOMESERVER");
                    }
                    if (hs !== null) {
                        resolve(hostBase + hs);
                    } else {
                        reject(err);
                    }
                });
            }
        });
    }

    /**
     * If the logged-in user is from an external Homeserver,
     * return true. Otherwise return false.
     * @returns {boolean}
     */
    static isCurrentUserExtern() {
        const hsUrl = MatrixClientPeg.get().getHomeserverUrl();
        return hsUrl.includes('.e.') || hsUrl.includes('.externe.');
    }

    /**
     * Return true if the given server url is external.
     * @param {string} hs
     * @returns {boolean}
     */
    static isUserExternFromServer(hs) {
        return hs.includes('.e.') || hs.includes('.externe.');
    }

    /**
     * Return true if the given server hostname is external.
     * @param {string} hs
     * @returns {boolean}
     */
    static isUserExternFromServerHostname(hs) {
        return hs.startsWith('e.') || hs.startsWith('agent.externe.');
    }

    /**
     * Given a user ID, return true if this user is from
     * an external Homeserver. Otherwise return false.
     * @param {string} userId The user ID to test for.
     * @returns {boolean}
     */
    static isUserExtern(userId) {
        return userId ? (
            userId.split(':')[1].startsWith('e.') ||
            userId.split(':')[1].startsWith('agent.externe.')
        ) : false;
    }

    /**
     * Lookup using the proxied API.
     * @param {string} medium
     * @param {string} address
     * @returns {object} A promise
     */
    static lookupThreePid(medium, address) {
        const homeserverUrl = MatrixClientPeg.get().getHomeserverUrl();
        const homeserverName = MatrixClientPeg.get().getIdentityServerUrl().split("https://")[1];
        const accessToken = MatrixClientPeg.get().getAccessToken();
        const url = `${homeserverUrl}${TchapApi.lookupUrl}?medium=${medium}&address=${address}&id_server=${homeserverName}`;
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        return fetch(url, options).then(res => {
            if (res.status && res.status !== 200) {
                console.log("Lookup : Use the MatrixClientPeg lookup");
                return MatrixClientPeg.get().lookupThreePid(medium, address);
            } else {
                return res.json();
            }
        }).catch(err => {
            console.log("Lookup : Use the MatrixClientPeg lookup");
            return MatrixClientPeg.get().lookupThreePid(medium, address);
        });
    }

    /**
     * Request a new validation email for expired account.
     */
    static requestNewExpiredAccountEmail() {
        const homeserverUrl = MatrixClientPeg.get().getHomeserverUrl();
        const accessToken = MatrixClientPeg.get().getAccessToken();
        const url = `${homeserverUrl}${TchapApi.accountValidityResendEmailUrl}`;
        const options = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        fetch(url, options);
    }

    /**
     * Return true if the current user is the last administrator of the given room.
     * @param {Room} room
     * @returns {boolean}
     */
    static isUserLastAdmin(room) {
        const userId = MatrixClientPeg.get().getUserId();
        const members = room.getJoinedMembers();
        let adminNumber = 0;
        let isUserAdmin = false;
        members.forEach(m => {
            if (m.powerLevelNorm >= 100) {
                if (m.userId === userId) {
                    isUserAdmin = true;
                }
                adminNumber++;
            }
        });
        return isUserAdmin && adminNumber <= 1;
    }

    /**
     * Given a room, return if this room is a "forum room" (old "public")
     * @param room
     * @returns {boolean}
     */
    static isRoomForum(room) {
        return !MatrixClientPeg.get().isRoomEncrypted(room.roomId) && this.getJoinRules(room) === "public";
    }

    /**
     * Given a room, return if this room is a "notice room" (system alert).
     * @param room
     * @returns {boolean}
     */
    static isRoomNotice(room) {
        return Object.keys(room.tags).includes("m.server_notice");
    }

    /**
     * Given a roomId, return the access_rule of the room.
     * @param {string} roomId The room ID to test for.
     * @returns {string} The access_rules of the room.
     */
    static getAccessRules(roomId) {
        const stateEventType = "im.vector.room.access_rules";
        const keyName = "rule";
        const defaultValue = "restricted";
        const room = MatrixClientPeg.get().getRoom(roomId);
        const event = room.currentState.getStateEvents(stateEventType, '');
        if (!event) {
            return defaultValue;
        }
        const content = event.getContent();
        return keyName in content ? content[keyName] : defaultValue;
    }

    /**
     *
     * @param {string} userId
     * @returns {Promise}
     */
    static getUserExpiredInfo(userId) {
        const infoUrl = TchapApi.expiredInfoUrl;
        const homeserverUrl = MatrixClientPeg.get().getHomeserverUrl();
        const accessToken = MatrixClientPeg.get().getAccessToken();
        const url = `${homeserverUrl}${infoUrl}${userId}/info`;

        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        return fetch(url, options).then(res => {
            return res.json();
        }).then(data => {
            return data.expired;
        });
    }

    /**
     * Given a room, return the stateEvent "m.room.join_rules"
     * @param room
     * @returns {string|*|string}
     */
    static getJoinRules(room) {
        const stateEventType = "m.room.join_rules";
        const keyName = "join_rule";
        const defaultValue = "public";
        const event = room.currentState.getStateEvents(stateEventType, '');
        if (!event) {
            return defaultValue;
        }
        const content = event.getContent();
        return keyName in content ? content[keyName] : defaultValue;
    }

    /**
     *
     * @param url
     * @returns {string|null}
     */
    static imgUrlToUri(url) {
        if (url && url.includes("/thumbnail/")) {
            const u = url.split("/thumbnail/")[1];
            return `mxc://${u}`;
        } else if (url && url.includes("/download/")) {
            const u = url.split("/download/")[1];
            return `mxc://${u}`;
        } else {
            return null;
        }
    }

    /**
     * Transform a text event into a pill event.
     * @param event
     * @returns {{format: string, body, msgtype: string, formatted_body: string}}
     */
    static pillifyRoomUrl(event) {
        const body = event.body;
        const roomAlias = body.split("/#/room/")[1];
        return {
            body: roomAlias,
            format: "org.matrix.custom.html",
            formatted_body: `<a href="${body}">${roomAlias}</a>`,
            msgtype: "m.text"
        };
    }

    /**
     * Does the given event looks like a room url ("/#/room/").
     * @param event
     * @returns {boolean}
     */
    static eventLooksLikeRoomUrl(event) {
        if (event.msgtype && event.msgtype === "m.text") {
            if (event.body && !event.format) {
                const body = event.body;
                return body.startsWith(SdkConfig.get()['base_host_url'] + '/#/room/#') ||
                    body.startsWith(Tchap.addWwwToUrl(SdkConfig.get()['base_host_url']) + '/#/room/#');
            }
        }
        return false;
    }

    /**
     * Add "www" to an URL.
     * @param {string} str The url to add "www".
     * @returns {string} The modified URL.
     */
    static addWwwToUrl(str) {
        if (str.startsWith("https://www.")) {
            return str;
        } else {
            const p = str.indexOf("//") + 2;
            return [str.slice(0, p), "www.", str.slice(p)].join('');
        }
    }

    /**
     * A fetch with a timeout option and an always resolver.
     * @param {string} url The url to fetch.
     * @param {object} opts init object from fetch() api plus a timeout option.
     * @returns {Promise}
     * @private
     */
    static _httpRequest(url, opts) {
        const options = opts || {};
        const timeoutValue = options.timeout || 30000;
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                resolve(new Error("timeout"));
            }, timeoutValue);
            fetch(url, options).then(
                (res) => {
                    clearTimeout(timeoutId);
                    resolve(res.json());
                },
                (err) => {
                    clearTimeout(timeoutId);
                    resolve({err});
                });
        });
    }

    /**
     * A static function shuffeling an array.
     * @param {array} arr The array to shuffle.
     * @returns {array} The array shuffeled.
     * @private
     */
    static _shuffle(arr) {
        for (let index = 0; index < arr.length; index++) {
            const r = Math.floor(Math.random() * arr.length);
            const tmp = arr[index];
            arr[index] = arr[r];
            arr[r] = tmp;
        }
        return arr.slice(0, arr.length);
    }

    /**
     * Capitalize a string.
     * @param {string} s The sting to capitalize.
     * @returns {string} The capitalized string.
     * @private
     */
    static _capitalize(s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
}

module.exports = Tchap;

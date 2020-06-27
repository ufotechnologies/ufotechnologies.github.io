export class Data {
    static init(data) {
        this.data = data;
    }

    /**
     * Public methods
     */

    static getHeadline = () => this.data.headline;

    static getLinks = () => this.data.links;
}

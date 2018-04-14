function SnapshotHandler(snapshots) {
    this.snapshots = snapshots || [];

    this.get = (id) => {
        return this.snapshots.filter(snapshot => { return snapshot.id == id })[0];
    };

    this.add = (name, cookies, url) => {
        var snapshot = {
            id: this.snapshots.length + 1,
            name: name,
            cookies: cookies,
            url: url,
        };
        this.snapshots.push(snapshot);
        return snapshot;
    };

    this.delete = (id) => {
        delete this.get(id);
    }

    this.getSnapshotNames = () => {
        return this.snapshots.map(snapshot => snapshot.name).sort();
    };

    this.toMap = () => { this.snapshots };
}


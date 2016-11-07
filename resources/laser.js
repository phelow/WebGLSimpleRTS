var lasers = [];

Unit = function (rigidbody, faction, target) {
    this.m_rigidbody = rigidbody;
    this.m_faction = faction;

    console.log("unit created, rigidbody:" + this.m_rigidbody);

    this.simpleAI = function () {
        //TODO: implement basic following ai
        //pick a target
        if (this.m_target == null) {
            
        }
        if (this.m_target != null) { //TODO: fix the bug where we're getting a vector to the origin.
            var forceDir = vectorSubtract(this.m_target.m_rigidbody.m_transform.pos, this.m_rigidbody.m_transform.pos);
            forceDir = normalize(forceDir);

            distanceMultiplier = getDistance2d(this.m_target.m_rigidbody.m_transform, this.m_target.m_rigidbody.m_transform) / this.m_forceMultiplier;

            console.log(distanceMultiplier);
            scale(forceDir, [distanceMultiplier, distanceMultiplier, distanceMultiplier], forceDir);

            this.m_rigidbody.addForce(forceDir[0], forceDir[1], forceDir[2]);
        }
    }
}
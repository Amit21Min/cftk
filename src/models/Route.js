const Route = {
    name: {
        type: String,
        required: true
    },
    streets: {
        type: [],
        required: true
    },
    canningData: {
        lastCanned: {
            type: Date
        },
        totalDonations: {
            type: Number
        }
    },
    volunteerNotes: {
        type: []
    },
    precreatedData: {
        dateModified: {
            type: Date
        },
        modifiedBy: {
            type: String
        },
        revisionHistory: {
            type: Array
        }
    },
    assignmentStatus: {
        type: Boolean,
        required: true
    }
}
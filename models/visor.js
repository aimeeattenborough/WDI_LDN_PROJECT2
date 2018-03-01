const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  maintitle: { type: String },
  content: { type: String },
  user: { type: mongoose.Schema.ObjectId, ref: 'User'},
  rating: { type: Number, min: 1, max: 5 },
  isModerated: { type: Boolean, default: false }
}, {
  timestamps: true
});

commentSchema
  .virtual('formattedDate')
  .get(function getFormattedDate() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[this.createdAt.getMonth()] + '-' + this.createdAt.getFullYear();
  });

// want to know is this comment owned by this user. This refers to comment. So the author of the comment is the same as the username. To allow only the author to delete it.
commentSchema.methods.isOwnedBy = function(user) {
  return this.user && user._id.equals(this.user._id);
};


// visor model
const schema = new mongoose.Schema({ //what data to expect and what it will look like.
  name: { type: String, minlength: 2, required: true },
  comfort: { type: Number, minlength: 1, required: true },
  peakAngle: { type: Number, minlength: 1, required: true },
  shadeThrowing: { type: Number, minlength: 1, required: true },
  image: { type: String, pattern: /https?:\/\/.+/ },
  type: { type: String, minlength: 1},
  map: {
    lat: { type: Number },
    lng: { type: Number }
  },
  comments: [commentSchema]
}, {
  timestamps: true
});

// ratings
schema
  .virtual('avgRating')
  .get(function getAvgRating() {
    if(this.comments.length === 0) return 'N/A';
    const ratings = this.comments.map(comment => comment.rating);
    return Math.round(((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 2) / 2);
  });

module.exports = mongoose.model('Visor', schema);

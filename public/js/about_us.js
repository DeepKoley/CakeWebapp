/* =========================================================
   CAKERMAKER - ABOUT US INTERACTIVITY & REVIEWS SLIDER
   ========================================================= */

const aboutReviews = [
  {
    quote: "The Classic Chocolate Truffle for my birthday was unbelievably fresh and moist. Arrived right on time and was loved by all my guests!",
    name: "Rahul Banerjee",
    role: "Verified Buyer &bull; Classic Chocolate Truffle",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop"
  },
  {
    quote: "Ordered the eggless Strawberry Chocolate cake. The texture was super soft and taste was balanced perfectly without being overly sweet.",
    name: "Pooja Das",
    role: "Regular Customer &bull; Strawberry Duet",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop"
  },
  {
    quote: "Best custom-designed wedding cake in town! Everyone at the reception was stunned by the elegance and heavenly flavor.",
    name: "Anirban Sharma",
    role: "Wedding Order &bull; Grand Floral Wedding Cake",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop"
  },
  {
    quote: "Royal Rasmalai Fusion Cake is an absolute revelation. Real rasmalai taste with light fluffy sponge. Highly recommend!",
    name: "Sneha Roy",
    role: "Cake Enthusiast &bull; Royal Rasmalai",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop"
  }
];

let currentReviewIdx = 0;

function showAboutReview(idx) {
  const rev = aboutReviews[idx];
  const quoteElem = document.getElementById('reviewQuoteText');
  const nameElem = document.getElementById('reviewAuthorName');
  const roleElem = document.getElementById('reviewRoleTag');
  const avatarElem = document.getElementById('reviewAvatar');

  if (quoteElem) quoteElem.innerText = `"${rev.quote}"`;
  if (nameElem) nameElem.innerText = rev.name;
  if (roleElem) roleElem.innerHTML = rev.role;
  if (avatarElem) avatarElem.src = rev.avatar;
}

function nextAboutReview() {
  currentReviewIdx = (currentReviewIdx + 1) % aboutReviews.length;
  showAboutReview(currentReviewIdx);
}

function prevAboutReview() {
  currentReviewIdx = (currentReviewIdx - 1 + aboutReviews.length) % aboutReviews.length;
  showAboutReview(currentReviewIdx);
}

function toggleFaq(itemElem) {
  itemElem.classList.toggle('active');
}
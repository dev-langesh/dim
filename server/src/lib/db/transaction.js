const mongoose = require("mongoose");

async function runTransaction(callback) {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(() => callback(session));
  } catch (err) {
    console.error("Transaction failed and was rolled back:", err);
  } finally {
    session.endSession();
  }
}

module.exports = {
  runTransaction,
};

const Payment = require('../models/paymentModel');
const User = require('../models/userModel');
const Goal = require('../models/goalModel');

const createTransaction = async (req, res) => {
  const {
    m_payment_id,
    pf_payment_id,
    payment_status,
    item_name,
    item_description,
    amount_gross,
    amount_fee,
    amount_net,
    custom_str1, // Address
    custom_str2, // Country
    custom_str3, // State/Province
    custom_str4,
    custom_str5,
    custom_int1, // Phone Number
    custom_int2, // Zip Code
    custom_int3,
    custom_int4,
    custom_int5,
    name_first,
    name_last,
    email_address,
    merchant_id,
    signature,
  } = req.body;

  if (payment_status === 'COMPLETE') {
    // Create a transaction in the database
    const user = await User.findOne({ email: email_address });
    if (user) {
      const payment = new Payment({
        userId: user._id,
        amount: amount_gross,
        successful: true,
        method: 'credit',
      });
      paymentRes = await payment.save();
      // Update the user's paymentIds and totalPaid
      user.paymentIds.push(paymentRes._id);
      user.totalPaid = String(Number(user.totalPaid) + Number(amount_gross));
      const userRes = await user.save();
      res.status(200).json({
        message: 'Payment successful',
        userData: userRes,
        paymentData: paymentRes,
      });
    } else {
      // Create a new user and transaction in the database
      const newUser = new User({
        firstName: name_first,
        lastName: name_last,
        email: email_address,
        address: custom_str1,
        country: custom_str2,
        state: custom_str3,
        phoneNumber: custom_int1,
        zipCode: custom_int2,
        totalPaid: amount_gross,
        paymentIds: [],
      });
      userRes = await newUser.save();
      const payment = new Payment({
        userId: userRes._id,
        amount: amount_gross,
        successful: true,
        method: 'credit',
      });
      paymentRes = await payment.save();
      userRes.paymentIds.push(paymentRes._id);
      const userSaveRes = await userRes.save();
      res.status(200).json({
        message: 'Payment successful and user created',
        userData: userSaveRes,
        paymentData: paymentRes,
      });
    }

    // //update the current goal after someone has paid
    const goal = await Goal.findOne({ isCurrentGoal: true });
    // // //
    goal.currentTotal += Number(amount_gross);
    goalRes = await goal.save();
  } else {
    // Log the error for debugging
    console.error('Payment failed:', req.body);
    res.status(200).json({ message: 'Payment failed' });
  }
};

module.exports = {
  createTransaction,
};

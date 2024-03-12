const en = require('../../locale/en');
const config = require('config');
require('dotenv').config();
const clientConfig = config.get('client');
const emailConfig = config.get('email');
const nodemailer = require('nodemailer');

function otpHtmlTemplate(token) {
  return `
  <div class="w-full flex flex-col items-center justify-center p-5">
  <div class="py-10">
    <img
      src="https://res.cloudinary.com/lcu-feeding/image/upload/v1710216590/kota/Kota._1_f8gven.png"
      alt="Kota Logo"
    />
  </div>

  <div class="rounded-sm shadow-lg w-full px-3 py-10">
    <p class="text-center font-sans font-medium text-gray-700">Hello,</p>

    <p class="mt-1 text-center font-sans font-medium text-gray-700">
      You have requested to automatically verify your email address for Kota.
    </p>

    <div class="my-5 flex justify-center">
      <button
        class="bg-[#2b6c57] text-white rounded-md px-5 py-3 font-sans font-medium"
      >
        <a href=${clientConfig.url + token} target="_blank"
          >Click here to verify</a
        >
      </button>
    </div>

    <p class="mt-1 text-center text-sm font-sans font-medium text-gray-700">
      Or click on this link:
    </p>

    <p class="mt-1 text-center text-sm font-sans font-medium text-blue-700">
      <a href=${clientConfig.url + token} target="_blank"
        >${clientConfig.url + token}</a
      >
    </p>

    <p class="mt-5 text-center font-sans font-medium text-gray-700">
      Link is valid for <span class="text-[#2b6c57]"> 15 minutes</span>
    </p>

    <p class="mt-6 text-center font-sans font-medium text-gray-700">Thanks!</p>

    <p class="mt-1 text-center font-sans font-medium text-gray-700">
      Kota team
    </p>
  </div>
  <script src="https://cdn.tailwindcss.com"></script>
</div>

    `;
}

async function sendEmail(receipientEmail, token) {

  const transport = nodemailer.createTransport({
    host: 'smtp.zeptomail.eu',
    port: 587,
    auth: {
      user: 'emailapikey',
      pass: emailConfig.apiKey,
    },
  });

  const mailOptions = {
    from: `"Kota" <${emailConfig.domain}>`,
    to: receipientEmail,
    subject: 'Kota Verification ✅✅',
    text: 'Your Kota OTP is ...',
    html: otpHtmlTemplate(token),
  };

  try {
    const result = await transport.sendMail(mailOptions);
    console.info('Sent to for delivery');
    return result;
  } catch (error) {
    console.error(error);
    throw new Error(en['email-not-sent']);
  }
}

module.exports = { sendEmail };

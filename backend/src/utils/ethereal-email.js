const nodemailer = require('nodemailer');
const config = require('config');
const en = require('../../locale/en');
const account = config.get('ethereal');
require('dotenv').config();
const clientConfig = config.get('client');

async function sendEmail(email, token) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'manley.barton17@ethereal.email',
        pass: 'EqeA3hWykPtDVvJ54z',
      },
    });

    let message = {
      from: `Sender Name ${account.user}`,
      to: `Recipient ${email}`,
      subject: 'Nodemailer is unicode friendly ✔',
      text: 'Hello to myself!',
      html: `
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
        <a href="${clientConfig.url}${token}" target="_blank"
          >Click here to verify</a
        >
      </button>
    </div>

    <p class="mt-1 text-center text-sm font-sans font-medium text-gray-700">
      Or click on this link:
    </p>

    <p class="mt-1 text-center text-sm font-sans font-medium text-blue-700">
      <a href="${clientConfig.url}${token}" target="_blank"
        >${clientConfig.url}${token}</a
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

        `,
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log('Error occurred. ' + err.message);
        return reject(Error(en['email-not-sent']));
      }

      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      resolve(nodemailer.getTestMessageUrl(info));
    });
  });
}

module.exports = { sendEmail };

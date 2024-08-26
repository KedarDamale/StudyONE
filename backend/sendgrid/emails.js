import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
	WELCOME_EMAIL_TEMPLATE,
  } from "./emailTemplates.js";
  import sgMail from '@sendgrid/mail';
  import { sender } from "./sendgrid.config.js";
  
  export const sendVerificationEmail = async (email, verificationToken) => {
	const msg = {
	  to: email,
	  from: sender,
	  subject: "Verify your email",
	  html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
	};
  
	try {
	  await sgMail.send(msg);
	  console.log("Verification email sent successfully");
	} catch (error) {
	  console.error("Error sending verification email:", error);
	  throw new Error(`Error sending verification email: ${error.message}`);
	}
  };
  
  export const sendWelcomeEmail = async (email, name) => {
	const msg = {
	  to: email,
	  from: sender,
	  subject: "Welcome to StudyONE",
	  html: WELCOME_EMAIL_TEMPLATE.replace(/{name}/g, name),
	};
  
	try {
	  await sgMail.send(msg);
	  console.log("Welcome email sent successfully");
	} catch (error) {
	  console.error("Error sending welcome email:", error);
	  throw new Error(`Error sending welcome email: ${error.message}`);
	}
  };
  
  export const sendPasswordResetEmail = async (email, resetURL) => {
	const msg = {
	  to: email,
	  from: sender,
	  subject: "Reset your password",
	  html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
	};
  
	try {
	  await sgMail.send(msg);
	  console.log("Password reset email sent successfully");
	} catch (error) {
	  console.error("Error sending password reset email:", error);
	  throw new Error(`Error sending password reset email: ${error.message}`);
	}
  };
  
  export const sendResetSuccessEmail = async (email) => {
	const msg = {
	  to: email,
	  from: sender,
	  subject: "Password Reset Successful",
	  html: PASSWORD_RESET_SUCCESS_TEMPLATE,
	};
  
	try {
	  await sgMail.send(msg);
	  console.log("Password reset success email sent successfully");
	} catch (error) {
	  console.error("Error sending password reset success email:", error);
	  throw new Error(`Error sending password reset success email: ${error.message}`);
	}
  };
  
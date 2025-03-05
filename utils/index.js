import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(6).label('Password')
});

export const signupValidationSchema = Yup.object().shape({
  fullname: Yup.string().required('Full Name is required.').label('Full Name'),
  phonenumber: Yup.string().required().length(11).label('Phone Number'),
  email: Yup.string().required().email('Enter a valid email.').label('Email'),
  password: Yup.string().required('Password must have a minimum of 6 characters.').min(6).label('Password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Confirm Password must match Password.')
    .required('Confirm Password is required.'),
});

export const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().min(6).required().label('Current Password'),
  newPassword: Yup.string().required().min(6).label('New Password'),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Confirm New Password must match New Password.')
    .required('Confirm New Password is required.'),
});

export const passwordResetSchema = Yup.object().shape({
  email: Yup.string()
    .required('Please enter a registered email.')
    .label('Email')
    .email('Enter a valid email.')
});

import * as yup from 'yup';

export const validationSchema = [
    yup.object({
        fullName: yup.string().required('Full Name is required.'),
        address1: yup.string().required('First line of Address is required.'),
        city: yup.string().required('Name of City is required.'),
        state: yup.string().required('Name of State is required.'),
        zip: yup.string().required('The zip code is required.'),
        country: yup.string().required('The country is required.')
    }),
    yup.object(),
    yup.object({
        nameOnCard: yup.string().required()
    })
] 
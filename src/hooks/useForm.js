import { useState, useCallback, useEffect } from 'react';
export function useForm({ initialValues, validators = {}, onSubmit }) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const validateField = useCallback((name, value) => {
        const validator = validators[name];
        if (!validator)
            return '';
        const result = validator(value);
        return result.errors[0] || '';
    }, [validators]);
    const validateForm = useCallback(() => {
        const newErrors = {};
        let formIsValid = true;
        Object.keys(values).forEach((key) => {
            const error = validateField(key, values[key]);
            if (error) {
                formIsValid = false;
                newErrors[key] = error;
            }
        });
        setErrors(newErrors);
        setIsValid(formIsValid);
        return formIsValid;
    }, [values, validateField]);
    const handleChange = useCallback((name, value) => {
        setValues(prev => ({ ...prev, [name]: value }));
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    }, [validateField]);
    const handleBlur = useCallback((name) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, values[name]);
        setErrors(prev => ({ ...prev, [name]: error }));
    }, [validateField, values]);
    const handleSubmit = useCallback(async (e) => {
        if (e) {
            e.preventDefault();
        }
        // Mark all fields as touched
        const allTouched = Object.keys(values).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {});
        setTouched(allTouched);
        const isFormValid = validateForm();
        if (!isFormValid)
            return;
        setIsSubmitting(true);
        try {
            if (onSubmit) {
                await onSubmit(values);
            }
        }
        finally {
            setIsSubmitting(false);
        }
    }, [values, validateForm, onSubmit]);
    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }, [initialValues]);
    // Validate form when validators change
    useEffect(() => {
        validateForm();
    }, [validators, validateForm]);
    return {
        values,
        errors,
        touched,
        isValid,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        reset,
        setValues,
        setErrors,
        setTouched
    };
}

import React, { Fragment, useState ,useReducer, useContext } from "react";
import classes from './Checkout.module.css';
import CartContext from "../../store/cart-context";

const formInitialState = {
    name: "",
    street: "",
    postalCode: "",
    city: ""
};

const formReducer = (state, action) => {
    if (action.type === "nameInput") {
        return {
            name: action.value,
            street: state.street,
            postalCode: state.postalCode,
            city: state.city
        }
    }
    if (action.type === "streetInput") {
        return {
            name: state.name,
            street: action.value,
            postalCode: state.postalCode,
            city: state.city,
        }
    }
    if (action.type === "postalCodeInput") {
        return {
            name: state.name,
            street: state.street,
            postalCode: action.value,
            city: state.city
        }
    }
    if (action.type === "cityInput") {
        return {
            name: state.name,
            street: state.street,
            postalCode: state.postalCode,
            city: action.value
        }
    }
    return formInitialState;
}

const Checkout = (props) => {

    const cartCtx = useContext(CartContext);

    const [inputTouched, setInputTouched] = useState({
        name: false,
        street: false,
        postalCode: false,
        city: false
    })

    const [formState, dispatchForm] = useReducer(formReducer, formInitialState);

    const nameInputIsValid = formState.name.trim().length > 0;
    const streetInputIsValid = formState.street.trim().length > 0;
    const postalCodeInputIsValid = formState.postalCode.trim().length === 5;
    const cityInputIsValid = formState.city.trim().length > 0;
    
    const nameIsNotValid = !nameInputIsValid && inputTouched.name;
    const streetIsNotValid = !streetInputIsValid  && inputTouched.street;
    const postalCodeIsNotValid = !postalCodeInputIsValid  && inputTouched.postalCode;
    const cityIsNotValid = !cityInputIsValid && inputTouched.city;

    const nameInputHandler = (event) => {
        dispatchForm({ type: "nameInput", value: event.target.value })
    };

    const nameBlurHandler = () => {
        setInputTouched(prevState => {
            return { ...prevState, name: true }
        })
    };

    const streetInputHandler = (event) => {
        dispatchForm({ type: "streetInput", value: event.target.value })
    };

    const streetBlurHandler = () => {
        setInputTouched(prevState => {
        return { ...prevState, street: true }
        })
    };

    const postalCodeInputHandler = (event) => {
        dispatchForm({ type: "postalCodeInput", value: event.target.value })
    };

    const postalCodeBlurHandler = () => {
        setInputTouched(prevState => {
            return { ...prevState, postalCode: true }
        })
    };

    const cityInputHandler = (event) => {
        dispatchForm({ type: "cityInput", value: event.target.value })
    };

    const cityBlurHandler = () => {
        setInputTouched(prevState => {
            return { ...prevState, city: true }
        })
    };

    const submitCheckoutForm = (event) => {
        event.preventDefault();
        props.onIsSubmitting(true);
        const tempSubmitData = {
            items: cartCtx.items,
            customerData: formState
        }
        console.log(cartCtx.items);
        const submitData = async () => {
            try {
                const response = await fetch("https://react-http-2bc42-default-rtdb.asia-southeast1.firebasedatabase.app/orders.json", {
                    method: "POST",
                    body: JSON.stringify(tempSubmitData),
                    headers: {
                        'Content-type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error(response.error);
                };
            }
            catch (error) {
                console.log(error.message)
                alert (error.message);
            }
            props.onIsSubmitting(false);
            props.onDidSubmit(true);
            cartCtx.clearCart();
        }
        submitData();
    }

    const formIsValid = nameInputIsValid && streetInputIsValid && postalCodeInputIsValid && cityInputIsValid;
    console.log(formIsValid)

    const nameInputClasses = `${classes.control} ${nameIsNotValid ? classes.invalid : null}`;
    const streetInputClasses = `${classes.control} ${streetIsNotValid ? classes.invalid : null}`;
    const postalCodeInputClasses = `${classes.control} ${postalCodeIsNotValid ? classes.invalid : null}`;
    const cityInputClasses = `${classes.control} ${cityIsNotValid ? classes.invalid : null}`;
    
    return (
        <Fragment>
            <form className={classes.form} onSubmit={submitCheckoutForm}>
                <div className={nameInputClasses}>
                    <label htmlFor="name">Your Name</label>
                    <input id="name" type="text" value={formState.name} onChange={nameInputHandler} onBlur={nameBlurHandler} ></input>
                    {nameIsNotValid && <p>Please enter a valid name!</p>}
                </div>
                <div className={streetInputClasses}>
                    <label htmlFor="street">Street</label>
                    <input id="street" type="text" value={formState.street} onChange={streetInputHandler} onBlur={streetBlurHandler} ></input>
                    {streetIsNotValid && <p>Please enter a valid street!</p>}
                </div>
                <div className={postalCodeInputClasses}>
                    <label htmlFor="postalCode">Postal Code</label>
                    <input id="postalCode" type="text" value={formState.postalCode} onChange={postalCodeInputHandler} onBlur={postalCodeBlurHandler} ></input>
                    {postalCodeIsNotValid && <p>Please enter a valid postal code (5 characters long)!</p>}
                </div>
                <div className={cityInputClasses}>
                    <label htmlFor="city">City</label>
                    <input id="city" type="text" value={formState.city} onChange={cityInputHandler} onBlur={cityBlurHandler} ></input>                        
                    {cityIsNotValid && <p>Please enter a valid city!</p>}
                </div>
                <div className={classes.actions}>
                    <button type="button" onClick={props.onCancel}>Cancel</button>
                    <button className={classes.submit} type="submit" disabled={!formIsValid}>Confirm</button>
                </div>
            </form>
        </Fragment>
    );
};

export default Checkout;
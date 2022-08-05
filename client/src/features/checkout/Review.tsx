import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useAppSelector } from '../../app/store/configureStore';
import CartSummary from '../cart/CartSummary';
import CartTable from '../cart/CartTable';

export default function Review() {
    const { cart } = useAppSelector(state => state.cart);

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Order summary
            </Typography>
            {cart &&
                <CartTable items={cart.items} isCart={false} />}
            <Grid container>
                <Grid item xs={6} />
                <Grid item xs={6}>
                    <CartSummary />
                </Grid>
            </Grid>
        </>
    );
}

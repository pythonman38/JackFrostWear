import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { currencyFormat } from "../../app/utilities/util";
import { addCartItemAsync, removeCartItemAsync } from "./cartSlice";
import CartSummary from "./CartSummary";

export default function CartPage() {
    const { cart, status } = useAppSelector(state => state.cart);
    const dispatch = useAppDispatch();

    if (!cart) return <Typography variant='h3'>Your shopping cart is empty!</Typography>

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="right">Subtotal</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cart.items.map(item => (
                            <TableRow
                                key={item.productId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <Box display='flex' alignItems='center'>
                                        <img src={item.pictureUrl} alt={item.name} style={{ height: 50, marginRight: 20 }} />
                                        <span>{item.name}</span>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">{currencyFormat(item.price)}</TableCell>
                                <TableCell align="center">
                                    <LoadingButton
                                        loading={status.includes('pendingRemoveItem' + item.productId + 'rem')}
                                        onClick={() => dispatch(removeCartItemAsync({ productId: item.productId, quantity: 1, name: 'rem' }))}
                                        color='error'
                                    >
                                        <Remove />
                                    </LoadingButton>
                                    {item.quantity}
                                    <LoadingButton
                                        loading={status.includes('pendingAddItem' + item.productId)}
                                        onClick={() => dispatch(addCartItemAsync({ productId: item.productId }))}
                                        color='secondary'
                                    >
                                        <Add />
                                    </LoadingButton>
                                </TableCell>
                                <TableCell align="right">{currencyFormat(item.price * item.quantity)}</TableCell>
                                <TableCell align="right">
                                    <LoadingButton
                                        loading={status.includes('pendingRemoveItem' + item.productId + 'del')}
                                        onClick={() => dispatch(removeCartItemAsync({ productId: item.productId, quantity: item.quantity, name: 'del' }))}
                                        color='error'
                                    >
                                        <Delete />
                                    </LoadingButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid container>
                <Grid item xs={6} />
                <Grid item xs={6}>
                    <CartSummary />
                    <Button component={Link} to='/checkout' variant='contained' size='large' fullWidth>Checkout</Button>
                </Grid>
            </Grid>
        </>
    )
}
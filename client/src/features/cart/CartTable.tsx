import { Remove, Add, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";
import { CartItem } from "../../app/models/cart";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";
import { currencyFormat } from "../../app/utilities/util";
import { removeCartItemAsync, addCartItemAsync } from "./cartSlice";

interface Props {
    items: CartItem[];
    isCart?: boolean;
}

export default function CartTable({ items, isCart = true }: Props) {
    const { status } = useAppSelector(state => state.cart);
    const dispatch = useAppDispatch();

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                        {isCart &&
                            <TableCell align="right"></TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map(item => (
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
                                {isCart &&
                                    <LoadingButton
                                        loading={status.includes('pendingRemoveItem' + item.productId + 'rem')}
                                        onClick={() => dispatch(removeCartItemAsync({ productId: item.productId, quantity: 1, name: 'rem' }))}
                                        color='error'
                                    >
                                        <Remove />
                                    </LoadingButton>}
                                {item.quantity}
                                {isCart &&
                                    <LoadingButton
                                        loading={status.includes('pendingAddItem' + item.productId)}
                                        onClick={() => dispatch(addCartItemAsync({ productId: item.productId }))}
                                        color='secondary'
                                    >
                                        <Add />
                                    </LoadingButton>}
                            </TableCell>
                            <TableCell align="right">{currencyFormat(item.price * item.quantity)}</TableCell>
                            {isCart &&
                                <TableCell align="right">
                                    <LoadingButton
                                        loading={status.includes('pendingRemoveItem' + item.productId + 'del')}
                                        onClick={() => dispatch(removeCartItemAsync({ productId: item.productId, quantity: item.quantity, name: 'del' }))}
                                        color='error'
                                    >
                                        <Delete />
                                    </LoadingButton>
                                </TableCell>}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
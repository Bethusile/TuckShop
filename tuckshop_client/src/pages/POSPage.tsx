// tuckshop_client/src/pages/POSPage.tsx (COMPLETE CODE with Corrected Grid Syntax and Checkout Logic)

import React, { useState, useEffect, useCallback } from 'react';
import { 
    Container, Typography, Box, Grid, Paper, Divider, 
    Button, Alert, CircularProgress, Card, CardContent, IconButton 
} from '@mui/material';
import type { IProduct } from '../types/Product';
import { getAllProducts, checkoutSale } from '../api/productAPI'; // <-- Import checkoutSale
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

// --- TYPES FOR CART ---
interface ICartItem {
    productid: number;
    name: string;
    price: number;
    quantity: number;
    total: number;
}

// --- PRODUCT CARD COMPONENT ---

interface ProductCardProps {
    product: IProduct;
    onAddToCart: (product: IProduct) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1" component="div">
                    {product.name}
                </Typography>
                <Typography variant="h6" color="primary">
                    R{product.price.toFixed(2)}
                </Typography>
                <Typography 
                    variant="body2" 
                    color={product.stocklevel > 0 ? "text.secondary" : "error"}
                    sx={{ fontWeight: product.stocklevel === 0 ? 'bold' : 'normal' }}
                >
                    Stock: {product.stocklevel === 0 ? 'OUT OF STOCK' : product.stocklevel}
                </Typography>
                <Button 
                    size="small" 
                    color="primary" 
                    variant="contained"
                    startIcon={<AddShoppingCartIcon />}
                    sx={{ mt: 1 }}
                    disabled={product.stocklevel === 0}
                    onClick={() => onAddToCart(product)}
                    fullWidth
                >
                    Add to Cart
                </Button>
            </CardContent>
        </Card>
    );
};


// --- MAIN POS PAGE COMPONENT ---

const POSPage: React.FC = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cart, setCart] = useState<ICartItem[]>([]);
    
    // --- Data Fetching ---
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllProducts();
            setProducts(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to load products. Check server connection.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // --- Cart Handlers ---

    const handleAddToCart = (product: IProduct) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.productid === product.productid);

            if (existingItem) {
                if (existingItem.quantity >= product.stocklevel) {
                    setError(`Cannot add more than ${product.stocklevel} of ${product.name}.`);
                    return prevCart;
                }
                
                return prevCart.map(item =>
                    item.productid === product.productid
                        ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
                        : item
                );
            } else {
                if (product.stocklevel === 0) {
                     setError(`${product.name} is out of stock.`);
                     return prevCart;
                }
                return [
                    ...prevCart,
                    {
                        productid: product.productid,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                        total: product.price,
                    },
                ];
            }
        });
        setError(null);
    };

    const handleUpdateQuantity = (productId: number, delta: number) => {
        setCart(prevCart => {
            const item = prevCart.find(i => i.productid === productId);
            const product = products.find(p => p.productid === productId);

            if (!item || !product) return prevCart;

            const newQuantity = item.quantity + delta;

            if (newQuantity <= 0) {
                return prevCart.filter(i => i.productid !== productId);
            }
            
            if (newQuantity > product.stocklevel) {
                setError(`Cannot exceed stock limit of ${product.stocklevel} for ${product.name}.`);
                return prevCart;
            }

            return prevCart.map(i =>
                i.productid === productId
                    ? { ...i, quantity: newQuantity, total: newQuantity * i.price }
                    : i
            );
        });
        setError(null);
    };

    const handleRemoveItem = (productId: number) => {
        setCart(prevCart => prevCart.filter(item => item.productid !== productId));
    };

    const handleClearCart = () => {
        setCart([]);
        setError(null);
    };

    // --- FINAL CHECKOUT LOGIC ---
    const handleCheckout = async () => {
        if (cart.length === 0) {
            setError("The cart is empty. Please add products to check out.");
            return;
        }

        const saleItems = cart.map(item => ({
            productid: item.productid,
            quantity: item.quantity,
            price: item.price,
        }));
        
        setLoading(true);
        setError(null);

        try {
            // Call the API to execute the sale and deduct stock
            await checkoutSale(saleItems);
            
            alert(`Sale successful! Total: R${cartTotal.toFixed(2)}`);
            
            // On success: Clear cart and refresh product list to show new stock levels
            handleClearCart();
            await fetchProducts(); 
            
        } catch (err: any) {
            const serverMessage = err.response?.data?.message || "A server error occurred during checkout. Check stock levels.";
            setError(serverMessage);
            
        } finally {
            setLoading(false);
        }
    };

    // --- Calculations ---
    const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);


    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                Point of Sale (POS) Terminal
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Grid container using size={{...}} syntax */}
            <Grid container spacing={3}>
                
                {/* --- Left Column: Product Selector --- */}
                <Grid size={{ xs: 12, md: 8 }}> 
                    <Typography variant="h6" gutterBottom>Available Products</Typography>
                    <Paper elevation={3} sx={{ p: 2, minHeight: 600 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                                <CircularProgress />
                            </Box>
                        ) : error && products.length === 0 ? (
                            <Alert severity="warning">No products available or failed to load.</Alert>
                        ) : (
                            <Grid container spacing={2}>
                                {products.map(product => (
                                    // Grid size={{...}} for product cards
                                    <Grid size={{ xs: 6, sm: 4, lg: 3 }} key={product.productid}>
                                        <ProductCard product={product} onAddToCart={handleAddToCart} />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Paper>
                </Grid>
                
                {/* --- Right Column: Shopping Cart --- */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="h6" gutterBottom>Shopping Cart</Typography>
                    <Paper elevation={3} sx={{ p: 2, minHeight: 600, display: 'flex', flexDirection: 'column' }}>
                        
                        {/* Cart Items List */}
                        <Box sx={{ flexGrow: 1, maxHeight: 400, overflowY: 'auto', mb: 2 }}>
                            {cart.length === 0 ? (
                                <Alert severity="info">Cart is empty. Click on a product to add it.</Alert>
                            ) : (
                                cart.map(item => (
                                    <Box key={item.productid} sx={{ display: 'flex', alignItems: 'center', py: 1, borderBottom: '1px dotted #ccc' }}>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="body1">{item.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">R{item.price.toFixed(2)}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleUpdateQuantity(item.productid, -1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <RemoveIcon fontSize="inherit" />
                                            </IconButton>
                                            <Typography sx={{ px: 1 }}>{item.quantity}</Typography>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleUpdateQuantity(item.productid, 1)}
                                                disabled={item.quantity >= (products.find(p => p.productid === item.productid)?.stocklevel || 0)}
                                            >
                                                <AddIcon fontSize="inherit" />
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={() => handleRemoveItem(item.productid)}>
                                                <DeleteIcon fontSize="inherit" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                ))
                            )}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Totals and Checkout */}
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6">Total:</Typography>
                                <Typography variant="h6">R{cartTotal.toFixed(2)}</Typography>
                            </Box>
                            <Button 
                                variant="contained" 
                                color="success" 
                                fullWidth 
                                size="large"
                                startIcon={<ShoppingCartCheckoutIcon />}
                                onClick={handleCheckout}
                                disabled={cart.length === 0 || loading} // Disable during processing
                                sx={{ mb: 1 }}
                            >
                                Process Sale
                            </Button>
                            <Button 
                                variant="outlined" 
                                color="secondary" 
                                fullWidth 
                                onClick={handleClearCart}
                                disabled={cart.length === 0 || loading}
                            >
                                Clear Cart
                            </Button>
                        </Box>

                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default POSPage;
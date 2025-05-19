'use client';
import { addOrder } from '@/redux/cart/cartAction';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StripeCheckout from 'react-stripe-checkout';

export default function ProductDetails() {
	const [showPopup, setShowPopup] = useState(false);
	const [address, setAddress] = useState('');
	const [payNow, setPayNow] = useState(false);
	const { items } = useSelector((s) => s.cart);
	const router = useRouter();
	const dispatch = useDispatch();
	const products = items || [];

	const grandTotal = products.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0)

	const handleOrderSubmit = async () => {
		createOrder();
	};

	const handleRedirect = () => {
		router.push('/');
	};


	async function createOrder(token = {}) {
		try {
			const result = await dispatch(addOrder({
				date: Date(),
				address,
				items,
				...token,
				grandTotal
			}));

			if (addOrder.fulfilled.match(result)) {
				setShowPopup(false);
				router.push('/myorders');
			} else {
				alert(result.payload || 'Failed to place order');
			}
		} catch (error) {
			console.error('Unexpected error:', error);
			alert('Something went wrong while placing your order.');
		}
	}

	const handleToken = async (token, adresses) => {
		try {
			await createOrder({ token, payment: 'success' });
			alert('Payment successful and order placed!');
		} catch (error) {
			alert('Payment was successful, but something went wrong while placing the order.');
		}
	};

	return (
		<>
			<div className="min-vh-100 bg-light p-4">
				<div className="container">
					<h2 className="text-center mb-4">Your Order</h2>

					{products.map((product, idx) => (
						<div
							key={idx}
							className="card shadow-sm mb-4"
							style={{ maxWidth: '700px', margin: '0 auto' }}
						>
							<div className="row g-0">
								<div className="col-md-4">
									<img
										src={product.image}
										alt={product.name}
										className="img-fluid rounded-start object-fit-cover"
										style={{ height: '100%', objectFit: 'cover' }}
									/>
								</div>
								<div className="col-md-8">
									<div className="card-body">
										<h5 className="card-title">{product.name}</h5>
										<p className="card-text"><strong>Type:</strong> {product.type}</p>
										<p className="card-text"><strong>Price:</strong> ₹{product.price.toFixed(2)}</p>
										<p className="card-text"><strong>Quantity:</strong> {product.quantity}</p>
										<p className="card-text text-success fw-bold">
											Subtotal: ₹{(product.price * product.quantity).toFixed(2)}
										</p>
									</div>
								</div>
							</div>
						</div>
					))}

					{/* Address Input & Summary */}
					<div className="card shadow-lg p-4" style={{ maxWidth: '700px', margin: '0 auto' }}>
						<div className="mb-3">
							<label htmlFor="address" className="form-label fw-semibold">
								Delivery Address
							</label>
							<textarea
								id="address"
								className="form-control"
								rows="3"
								placeholder="Enter your full delivery address"
								value={address}
								onChange={(e) => setAddress(e.target.value)}
							/>
						</div>

						<div className="d-flex justify-content-between align-items-center mb-3">
							<h5 className="fw-bold mb-0">Grand Total:</h5>
							<h5 className="text-success mb-0">₹{grandTotal.toFixed(2)}</h5>
						</div>

						<div className="d-flex gap-3">
							<button className="btn btn-primary w-100" onClick={() => {
								if (!address.trim()) {
									alert('Please enter a delivery address.');
									return;
								}
								setShowPopup(true)
							}}>
								Order Now
							</button>
							<button className="btn btn-secondary w-100" onClick={handleRedirect}>
								Cancel
							</button>
						</div>
					</div>
				</div>

				{/* Confirmation Popup */}
				{showPopup && (
					<div className="modal d-block bg-dark bg-opacity-50">
						<div className="modal-dialog modal-dialog-centered">
							<div className="modal-content text-center">
								<div className="modal-body">
									<p className="fs-5 mb-3">Confirm your order to:</p>
									<div className="bg-light border p-3 mb-4 text-start rounded">
										{address || <em>No address entered</em>}
									</div>
									<div className='mt-4 mb-2'>
										<StripeCheckout
											stripeKey="pk_test_51JGNLWBVnEa8wQ1y8ZGMn9tw57qHCROwaNVr5eplb1UvQsN410gJpXPyNW8yFgNQZeM7twAoAjZ7LosccszLnDMz00pIIh0lL0"
											token={handleToken}
											amount={grandTotal.toFixed(2) * 100}
											name="Shopi Cart"
											currency="INR"
										/>
									</div>

									<div className="d-flex justify-content-center gap-3">
										<button className="btn btn-success" onClick={handleOrderSubmit}>
											Pay Later
										</button>
										<button
											className="btn btn-danger"
											onClick={() => setShowPopup(false)}
										>
											Cancel
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}

'use client'

import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { fetchUserData } from "../redux/user/userActions";
import { fetchCart } from "@/redux/cart/cartAction";
import CartPopup from "./CartPopup";
import { fetchUserData, logoutUser } from "@/redux/user/userActions";
import Link from "next/link";
import { filterProducts, setToken } from "@/redux/user/userSlice";
import { useRouter } from 'next/navigation';




export const Header = () => {
	const { items } = useSelector((state) => state.cart);
	const { loading, error, userData, token } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();

	const togglePopup = () => setIsOpen(!isOpen);
	console.log("token", token)
	async function handleLogoutUser(e) {
		e.preventDefault();
		dispatch(logoutUser());
		router.push('/')
	}
	useEffect(() => {
		const fetchData = async () => {
			if (true) {
				const result = dispatch(fetchUserData(token));
				console.log("Fetched User Data:", result);
			}
		};
		fetchData();
	}, []);


	return (
		<nav className="navbar navbar-expand-lg navbar-light">
			<div className="container-fluid">
				<a className="navbar-brand" href="/">Shopi</a>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNav"
					aria-controls="navbarNav"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<div className="d-flex w-100">
						{/* Left-aligned items */}
						<ul className="navbar-nav me-auto">
							<li className="nav-item" >
								<a className="nav-link active" aria-current="page" href="/" onClick={(e) => {
									e.preventDefault();
									dispatch(filterProducts('all'));
								}}>All</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="/" onClick={(e) => {
									e.preventDefault();
									dispatch(filterProducts('cloth'));
								}}>Clothes</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="/" onClick={(e) => {
									e.preventDefault();
									dispatch(filterProducts('electronics'));
								}}>Electronics</a>
							</li>

						</ul>
						{/* Right-aligned items */}
						<ul className="nav ms-auto">
							<li className="nav-item">
								<a className="nav-link active" aria-current="page" href="#">{userData?.email}</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="/myorders">My Orders</a>
							</li>
							<li className="nav-item">
								<Link className="nav-link" href="/myaccount">
									My Account
								</Link>
							</li>
							{!token ?
								<li className="nav-item">
									<Link className="nav-link" href="/auth/login">
										Login
									</Link>
								</li> : <li>	<button className="nav-link" href="#" onClick={(e) =>
									handleLogoutUser(e)
								}>LogOut</button>
								</li>
							}

							<li className="nav-item">
								<a className="nav-link" onClick={togglePopup}>
									<i className="fas fa-shopping-cart"></i> Cart ({items.length > 0 ? items?.length : 0})
								</a>
							</li>

						</ul>
					</div>
				</div>
			</div>
			<CartPopup setIsOpen={setIsOpen} isOpen={isOpen} togglePopup={togglePopup} />
		</nav>

	)
}
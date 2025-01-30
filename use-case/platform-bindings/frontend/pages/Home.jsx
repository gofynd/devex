import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import "./style/home.css";
import axios from "axios";
import urlJoin from "url-join";

const EXAMPLE_MAIN_URL = window.location.origin;

export const Home = () => {
  const [pageLoading, setPageLoading] = useState(false);
  const [shipmentResponse, setShipmentResponse] = useState([]);
  const { application_id, company_id } = useParams();

  useEffect(() => {
    isApplicationLaunch() ? fetchApplicationProducts() : fetchProducts();
    // showProductDetails();
  }, [application_id]);

  const fetchProducts = async () => {
    setPageLoading(true);
    try {
      const { data } = await axios.get(urlJoin(EXAMPLE_MAIN_URL, '/api/products'), {
        headers: {
          "x-company-id": company_id,
        }
      });
      setProductList(data.items);
    } catch (e) {
      console.error("Error fetching products:", e);
    } finally {
      setPageLoading(false);
    }
  };

  const fetchApplicationProducts = async () => {
    setPageLoading(true);
    try {
      const { data } = await axios.get(urlJoin(EXAMPLE_MAIN_URL, `/api/products/application/${application_id}`), {
        headers: {
          "x-company-id": company_id,
        }
      })
      setProductList(data.items);
    } catch (e) {
      console.error("Error fetching application products:", e);
    } finally {
      setPageLoading(false);
    }
  };

  const showProductDetails = async () => {
    setPageLoading(true);
    try {
      const url = document;
      // Sample url = "https://ravindrasinghr.github.io/binding/?company_id=8085&cluster_url=https%3A%2F%2Fapi.fynd.com&client_id=67456aa3b44337e4a6b40380&order_id=FY677B80B60E3D48C581&shipment_id=17361471264741496974&external_order_id=FY677B80B60E3D48C581";
      const cleanUrl = url.split("#")[0]; // Remove any fragment identifiers
      const urlObject = new URL(cleanUrl); // Parse the clean URL
      const urlParams = new URLSearchParams(urlObject.search); // Extract URL parameters
      const shipment_id = urlParams.get("shipment_id");

      if (!shipment_id) {
        throw new Error("Shipment ID is missing in the URL parameters.");
      }
      const response = await axios.post(`/api/order`, { shipment_id });

      if (!response?.data?.shipment) {
        throw new Error("Shipment details are missing in the API response.");
      }
      setShipmentResponse(response.data.shipment);
    } catch (error) {
      alert(
        error.message || "An unexpected error occurred while fetching order details."
      );
    } finally {
      setPageLoading(false);
    }
  };
  const isApplicationLaunch = () => !!application_id;

  return (
    <>
      {pageLoading ? (
        <div className="loader">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="products-container">
          <div className="title">
            This is an example extension home page user interface.
          </div>

          <div className="product-list-container">
            <div className="product-field">
              <strong>Order ID:</strong> {shipmentResponse.order_id}
            </div>
            <div className="product-field">
              <strong>Created At:</strong> {shipmentResponse.shipment_created_at}
            </div>
            <div className="product-field">
              <strong>Created TS:</strong> {shipmentResponse.shipment_created_ts}
            </div>
            <div className="product-field">
              <strong>Shipment ID:</strong> {shipmentResponse.shipment_id}
            </div>
            <div className="product-field">
              <strong>Order Type:</strong> {shipmentResponse.order_type}
            </div>
          </div>
        </div>
      )}
    </>
  );


}

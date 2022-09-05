import React, { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import io from 'socket.io';
import { useEffect, useState } from "react";


const Products = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios({
      method: "GET",
      url: "https://fakestoreapi.com/products",
    })
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  }, []);


  const [notification, setNotification] = useState("");
  const [notificationReceived, setNotificationReceived] = useState("");

  const socket = io();
  notification.options = {
      timeOut: 2000,
      positionClass : 'top-right',
      extendedTimeOut: 0,
      fadeOut: 0,
      fadeIn: 0,
      showDuration: 0,
      hideDuration: 0
  };
  
  const sendNotification = () => {
    socket.emit("send_notification", { notification });
  };

  useEffect(() => {
    socket.on("receive_notification", (data) => {
      setNotificationReceived(data.notification);
    });
  }, [socket]);


  return (

    <div className="products-container">

      {loading && (
        <div>
          {" "}
          <h1>Loading...</h1>
        </div>
      )}

      {data.map((product)=> ( 
          <div key={product.id} className="card">

           <div onClick={sendNotification}>
           <img src={product.image} alt="#"/></div>

           <div className="card-description">
               <h6>{product.title}</h6>
               <h6>{`Category: ${product.category}`}</h6>
           </div>
          </div>
      ))}
    </div>
  );
};

export default Products;
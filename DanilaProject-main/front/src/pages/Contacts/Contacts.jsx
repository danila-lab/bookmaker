import React from 'react';
import { IoMdMail } from "react-icons/io";
import { FaMapLocationDot } from "react-icons/fa6";
import { FaPhoneVolume } from "react-icons/fa6";

const Contacts = () => {
    return (
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <h1 style={{fontSize: 40, fontWeight: 700}}>Contacts</h1>
            <h1 style={{fontSize: 28, fontWeight: 600}}>Any questions? Contact us in any convenient way</h1>

            <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "center", marginTop: "100px"}}>
                <div style={{ backgroundColor: "#121212", width: "500px", height: "350px", borderRadius: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                <IoMdMail  style={{ width: "150px", height: "150px" }} size="sm"/>
                <p style={{color: 'gray'}}>Email tech. support</p>
                <p style={{ fontWeight: 700, color: "#ffcf49",fontSize: 24, marginTop: "10px" }}>support@ewager.com</p>
                </div>
                <div style={{ backgroundColor: "#121212", width: "500px", height: "350px", borderRadius: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginLeft: "50px", marginRight: "50px"}}>
                <FaPhoneVolume  style={{ width: "150px", height: "150px" }} size="sm"/>
                <p style={{color: 'gray'}}>Hotline number</p>
                <p style={{ fontWeight: 700, color: "#ffcf49", fontSize: 24, marginTop: "10px" }}>+371 50 43 43 12</p>
                </div>
                <div style={{ backgroundColor: "#121212", width: "500px", height: "350px", borderRadius: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginLeft: "50px", marginRight: "50px"}}>
                <FaMapLocationDot  style={{ width: "150px", height: "150px" }} size="sm"/>
                <p style={{color: 'gray'}}>Address</p>
                <p style={{ fontWeight: 700, color: "#ffcf49", fontSize: 24, marginTop: "10px" }}>Riga</p>
            </div>

            </div>
        </div>
    );
};

export default Contacts;

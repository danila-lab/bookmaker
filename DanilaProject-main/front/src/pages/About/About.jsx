import React from 'react';

const About = () => {
    return (
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <h1 style={{fontSize: 40, fontWeight: 700}}>About Us</h1>
            <p style={{ marginTop: "80px", fontSize: 24, whiteSpace: "pre-wrap", textAlign: "justify", lineHeight: "2", width: "50%" }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Welcome to the website of our betting company, specializing in esports betting!

                Who We Are
                We are a team of esports enthusiasts united by a shared passion for this rapidly growing world. Our mission is to provide esports fans with a unique and thrilling betting experience that not only complements your enthusiasm but also adds even more excitement and opportunities.
                <br /><br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Our Mission: We strive to become the leading provider of esports betting, offering the most competitive odds, a wide selection of events, and unique bonuses for our users. We understand that esports are not just games, but a whole world where millions of people around the globe live and breathe. We are here to help you become a part of this world, making it even more exciting and rewarding.
            </p>


            <img src='images/aboutimg.png' style={{ marginTop: "50px", width: "50%"}} />
        </div>
    );
};

export default About;

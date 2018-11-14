import React from "react";

const Photo = props => (
    <div className="Photo">
        <div className="Profile">
            <div className="Profile-photo ">
                <span className="Profile-photo-container">
          <img style={{'width': '100%'}}src={props.srcImage === null || props.srcImage === "sem" ? props.user.profile_image : "data:image/jpeg;charset=utf-8;base64, "+props.srcImage} />
        </span>
            </div>
            <div className="Profile-name">
                <a href={props.user.link} target="_blank">
                    {props.user.name}
                </a>
            </div>
        </div>
    </div>
);

export default Photo;
import React from "react";

const Photo = props => (
    <div className="Photo">
        <div className="Profile">
            <div className="Profile-photo ">
                <span className="Profile-photo-container">
          <img src={props.user.profile_image} />
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
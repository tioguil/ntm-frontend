import React from "react";

export default props => {

   const img = () =>  {
   return(
        <div>
            <span>
                <img src={props.img === null || props.img === "sem" ? "photo/default.jpg" : "data:image/jpeg;charset=utf-8;base64, " + props.img} className="icon-size" alt="photo-perfil"/>
                    {props.nome}
            </span>
        </div>
    )
}
return (
    <div>
      {img()}
    </div>
  );

}

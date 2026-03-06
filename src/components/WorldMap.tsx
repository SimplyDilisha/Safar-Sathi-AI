import React from "react";

const WorldMap = () => {
	return (
		<div className="w-full h-full flex items-center justify-center overflow-hidden rounded">
			<iframe
				title="World map"
				src="https://easymap.info/en/?lat=21.99740&lon=79.00110&z=5&mlat=24.016362&mlon=78.102787&c="
				className="w-full h-full"
				style={{ border: 0 }}
				loading="lazy"
				allowFullScreen
				referrerPolicy="no-referrer-when-downgrade"
			/>
		</div>
	);
};

export default WorldMap;


import React from 'react';
import Image from 'next/image';

function Logo({size = 100}: { size?: number}) {
    return (
        <div className={"rounded-full"}>
            <Image src={"/logo.png"} alt={"logo"} width={size} height={size}/>
        </div>
    );
}

export default Logo;
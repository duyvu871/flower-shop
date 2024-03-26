import React from 'react';

interface NavBarWrapperProps {
children: React.ReactNode
};

function NavBarWrapper({children}: NavBarWrapperProps) {
    return (
        <>
            {children}
        </>
    );
}

export default NavBarWrapper;
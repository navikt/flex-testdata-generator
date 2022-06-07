import React from 'react'

export default () => {
    return (
        <>
            <h2 style={{ color: 'red' }}>
                Du er ikke innlogget i testmiljøet. Logg inn i ditt sykefravær
                og prøv igjen
            </h2>
            <a href={'/'}>Prøv igjen</a>
        </>
    )
}

import { Button } from 'primereact/button';
import React from 'react';

export default function Content1() {
    return (
        <div className="grid grid-nogutter surface-0 text-800">
            <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">
                <section>
                    <span className="block text-6xl font-bold mb-1">Create your ideal project</span>
                    <div className="text-6xl text-primary font-bold mb-3">Bring your imagination into reality</div>
                    <p className="mt-0 mb-4 text-700 line-height-3">The services offer of requesting user project and bring it into reality.</p>

                    <Button label="Learn More" type="button" className="mr-3 p-button-raised" />
                    <Button label="Live Demo" type="button" className="p-button-outlined" />
                </section>
            </div>
            <div className="col-12 md:col-6 overflow-hidden">
                <img src="assets/images/blocks/hero/hero-1.png" alt="hero-1" className="md:ml-auto block md:h-full" style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)' }} />
            </div>
        </div>
    )
}

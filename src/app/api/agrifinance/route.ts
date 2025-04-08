import { NextRequest, NextResponse } from 'next/server';

import axios from 'axios';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const payload = {
            agriFinance: { ...body }
        };

        payload.agriFinance.latitude = parseFloat(payload.agriFinance.latitude.toString());
        payload.agriFinance.longitude = parseFloat(payload.agriFinance.longitude.toString());
        payload.agriFinance.land_area = parseFloat(payload.agriFinance.land_area.toString());
        payload.agriFinance.yield_estimation_year = parseInt(payload.agriFinance.yield_estimation_year.toString());

        const response = await axios({
            method: 'get',
            url: 'https://h3un7vgepphw3mosuok4h4jnv40nzdya.lambda-url.us-east-1.on.aws/',
            headers: {
                'Content-Type': 'application/json'
            },
            data: payload
        });

        console.log(response);

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('API error:', error);

        return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 });
    }
}

'use client';

import React, { useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { AlertCircle, Check, Loader2, Ruler } from 'lucide-react';

export default function AgriFinanceDashboard() {
    const [formData, setFormData] = useState({
        region: 'afar',
        latitude: 8.6,
        longitude: 36.5,
        land_area: 2,
        crop_type: 'potato',
        yield_estimation_year: 2025
    });

    const max_score = 850;

    const [score, setScore] = useState(0);
    const [rawScore, setRawScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const cropTypes = ['potato', 'maize', 'wheat', 'coffee', 'teff', 'barley', 'sorghum'];

    const regions = ['afar', 'amhara', 'oromia', 'tigray', 'somali', 'snnpr'];

    const handleChange = (field: any, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setSuccess(false);
        setError('');

        try {
            const response = await fetch('/api/agrifinance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            // Extract score from the response
            const apiScore = data?.agri_score || 0;
            setRawScore(apiScore);
            setScore((apiScore / max_score) * 100); // Assuming max_score is defined in the API response
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to submit data. Please try again.');
            setScore(0);
            setRawScore(0);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-gray-50 p-4 md:p-8'>
            <div className='mx-auto max-w-4xl'>
                <div className='mb-8 text-center'>
                    <h1 className='text-3xl font-bold text-gray-900'>AgriFinance Dashboard</h1>
                    <p className='mt-2 text-gray-600'>Analyze agricultural land and crop potential</p>
                </div>

                <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                    {/* Left Column - Input Form */}
                    <div className='lg:col-span-2'>
                        <Card className='shadow-md'>
                            <CardHeader>
                                <CardTitle>Land & Crop Information</CardTitle>
                                <CardDescription>Enter details about your agricultural project</CardDescription>
                            </CardHeader>
                            <CardContent className='space-y-6'>
                                {/* Region Select */}
                                <div className='flex flex-row justify-evenly'>
                                    <div className='mr-2 flex-1'>
                                        <Label htmlFor='region' className='mb-2'>
                                            Region
                                        </Label>
                                        <Select
                                            value={formData.region}
                                            onValueChange={(value) => handleChange('region', value)}>
                                            <SelectTrigger className='mr-5 w-full'>
                                                <SelectValue placeholder='Select region' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {regions.map((region) => (
                                                    <SelectItem key={region} value={region}>
                                                        {region.charAt(0).toUpperCase() + region.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {/* Crop Type */}

                                    <div className='flex-1'>
                                        <Label htmlFor='crop_type' className='mb-2'>
                                            Crop Type
                                        </Label>
                                        <Select
                                            value={formData.crop_type}
                                            onValueChange={(value) => handleChange('crop_type', value)}>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder='Select crop type' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {cropTypes.map((crop) => (
                                                    <SelectItem key={crop} value={crop}>
                                                        {crop.charAt(0).toUpperCase() + crop.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Geographic Coordinates */}
                                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='latitude'>Latitude</Label>
                                        <Input
                                            id='latitude'
                                            type='number'
                                            step='0.000001'
                                            value={formData.latitude}
                                            onChange={(e) => handleChange('latitude', e.target.value)}
                                        />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='longitude'>Longitude</Label>
                                        <Input
                                            id='longitude'
                                            type='number'
                                            step='0.000001'
                                            value={formData.longitude}
                                            onChange={(e) => handleChange('longitude', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor='land_area' className='flex items-center gap-2 text-sm font-medium'>
                                        <Ruler className='h-4 w-4' /> Land Area (hectares)
                                    </Label>
                                    <Input
                                        id='land_area'
                                        type='number'
                                        step='0.1'
                                        min='0.1'
                                        value={formData.land_area}
                                        onChange={(e) => handleChange('land_area', parseFloat(e.target.value))}
                                        className='rounded-lg'
                                    />
                                </div>

                                {/* Yield Estimation Year */}
                                <div className='space-y-2'>
                                    <Label htmlFor='yield_estimation_year'>Yield Estimation Year</Label>
                                    <Input
                                        id='yield_estimation_year'
                                        type='number'
                                        min='2022'
                                        max='2030'
                                        value={formData.yield_estimation_year}
                                        onChange={(e) => handleChange('yield_estimation_year', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className='w-full' onClick={handleSubmit} disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                            Processing
                                        </>
                                    ) : (
                                        'Calculate Agri Financial Score'
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Right Column - Gauge and Results */}
                    <div>
                        <Card className='h-full shadow-md'>
                            <CardHeader>
                                <CardTitle>Financial Score</CardTitle>
                                <CardDescription>Agricultural viability assessment</CardDescription>
                            </CardHeader>
                            <CardContent className='flex flex-col items-center justify-center'>
                                {/* Gauge Chart */}
                                <div className='relative mb-4 h-48 w-48'>
                                    <svg className='h-full w-full' viewBox='0 0 100 100'>
                                        {/* Background gauge */}
                                        <path
                                            d='M 10 70 A 40 40 0 1 1 90 70'
                                            fill='none'
                                            stroke='#e5e7eb'
                                            strokeWidth='10'
                                            strokeLinecap='round'
                                        />

                                        {/* Active gauge */}
                                        <path
                                            d='M 10 70 A 40 40 0 1 1 90 70'
                                            fill='none'
                                            stroke={score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'}
                                            strokeWidth='10'
                                            strokeLinecap='round'
                                            strokeDasharray={`${score * 1.8} 180`}
                                        />

                                        {/* space */}
                                        <circle cx='50' cy='70' r='5' fill='white' />

                                        {/* Center circle */}

                                        {/* Gauge text */}
                                        <text
                                            x='50'
                                            y='60'
                                            fontFamily='sans-serif'
                                            fontSize='20'
                                            textAnchor='middle'
                                            fill='currentColor'>
                                            {rawScore}
                                        </text>
                                        <text
                                            x='50'
                                            y='78'
                                            fontFamily='sans-serif'
                                            fontSize='10'
                                            textAnchor='middle'
                                            fill='gray'>
                                            Score
                                        </text>
                                    </svg>
                                </div>

                                {/* Score interpretation */}
                                <div className='mt-4 space-y-2 text-center'>
                                    <h3 className='font-medium'>
                                        {score >= 70
                                            ? 'Excellent Potential'
                                            : score >= 40
                                              ? 'Moderate Potential'
                                              : score > 0
                                                ? 'Limited Potential'
                                                : 'No Data'}
                                    </h3>
                                    <p className='text-sm text-gray-500'>
                                        {score >= 70
                                            ? 'High yield and investment return expected'
                                            : score >= 40
                                              ? 'Reasonable yield with moderate investment'
                                              : score > 0
                                                ? 'Consider alternative crops or methods'
                                                : 'Submit data to see potential'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Status messages */}
                <div className='mt-6'>
                    {success && (
                        <Alert className='border-green-200 bg-green-50'>
                            <Check className='h-4 w-4 text-green-600' />
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>Data submitted successfully and score calculated.</AlertDescription>
                        </Alert>
                    )}

                    {error && (
                        <Alert className='border-red-200 bg-red-50'>
                            <AlertCircle className='h-4 w-4 text-red-600' />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
}

import Constants from 'expo-constants';
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

const { manifest } = Constants

const api = (typeof manifest?.packagerOpts === `object`) && manifest.packagerOpts.dev
    ? manifest.debuggerHost?.split(':').shift()?.concat(`:3000`)
    : `api.myjobplanner.com`

console.log(api)

type Business = {
    name: string
}

type Props = {
    jwtToken: string
}

export default function BusinessSelect({ jwtToken }: Props) {
    const [data, setData] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        console.log(jwtToken)
        try {
            const resp = await fetch(`http://${api}/v1/businesses`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                }
            });
            if (resp.ok) {
                const data = await resp.json();
                setData(data);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    const renderItem = (item: Business) => {
        return (
            <View>
                <Text>{item.name}</Text>
            </View>
        )
    }

    useEffect(() => {
        fetchData();
    }, []);

    return loading ? null : (
        <View>
            {data.map(renderItem)}
        </View>
    )

}

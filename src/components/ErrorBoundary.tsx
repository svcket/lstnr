import React from 'react';
import { View, Text, ScrollView } from 'react-native';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({ errorInfo });
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={{ flex: 1, backgroundColor: 'red', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 99999 }}>
                    <ScrollView contentContainerStyle={{ padding: 20 }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>CRASH DETECTED</Text>
                        <Text style={{ color: 'white', marginTop: 10, fontSize: 16 }}>
                            {this.state.error?.toString()}
                        </Text>
                        <Text style={{ color: 'yellow', marginTop: 10, fontSize: 12 }}>
                            {this.state.errorInfo?.componentStack}
                        </Text>
                    </ScrollView>
                </View>
            );
        }
        return this.props.children;
    }
}

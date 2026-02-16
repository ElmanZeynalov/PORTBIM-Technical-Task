import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DesignersPage from './pages/DesignersPage';
import EditorPage from './pages/EditorPage';

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<DesignersPage />} />
					<Route path="/editor" element={<EditorPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

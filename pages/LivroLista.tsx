import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import { LinhaLivro } from '../componentes/LinhaLivro';
import { Livro } from '../classes/modelo/Livro';
import Menu from '../componentes/Menu'; 

const baseURL: string = "http://localhost:3000/api/livros";


const obter = async (): Promise<Livro[]> => {
    const response = await fetch(baseURL);
    const data = await response.json();
    return data;
};


const excluirLivro = async (codigo: number): Promise<boolean> => {
    const response = await fetch(`${baseURL}/${codigo}`, {
        method: 'DELETE',
    });
    const data = await response.json();
    return data.ok;
};

const LivroLista: NextPage = () => {
    const [livros, setLivros] = useState<Livro[]>([]);
    const [carregado, setCarregado] = useState<boolean>(false);

    useEffect(() => {
        const carregarLivros = async () => {
            const livrosObtidos = await obter();
            setLivros(livrosObtidos);
            setCarregado(true);
        };

        if (!carregado) {
            carregarLivros();
        }
    }, [carregado]);

    const excluir = async (codigo: number) => {
        const sucesso = await excluirLivro(codigo);
        if (sucesso) {
            setCarregado(false); 
        }
    };

    return (
        <div className={styles.container}>
            <Menu /> 
            <h1 className="text-center my-4">Catálogo de Livros</h1>
            <table className="table table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th>Título</th>
                        <th>Resumo</th>
                        <th>Editora</th>
                        <th>Autores</th>
                    </tr>
                </thead>
                <tbody>
                    {livros.map((livro) => (
                        <LinhaLivro 
                            key={livro.codigo}
                            livro={livro}
                            excluir={() => excluir(livro.codigo)} 
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LivroLista;

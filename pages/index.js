import styles from '@/styles/Home.module.scss'

import { useEffect, useState } from 'react'
import { database } from '@/services/firebase'

export default function Home() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [telefone, setTelefone] = useState("")

  const [contatos, setContatos] = useState()
  const [nomeAntigo, setNomeAntigo] = useState("")
  const [atualizando, setAtualizando] = useState(false)

  useEffect(() => {
    const refContatos = database.ref('usuarios')

    refContatos.on('value', resultado => {
      const resultadoContatos = Object.entries(resultado.val() ?? {}).map(([chave, valor]) => {
        return {
          'chave': chave,
          'nome': valor.nome,
          'email': valor.email,
          'telefone': valor.telefone
        }
      })
      setContatos(resultadoContatos)
    })
  }, [])

  function gravar(event){
    event.preventDefault()
    const ref = database.ref('usuarios')
    const dados = {
      nome,
      email,
      telefone
    }
    ref.push(dados)

    setNome('')
    setEmail('')
    setTelefone('')
  }
  
  function deletar(ref) {
    const referencia = database.ref(`usuarios/${ref}`).remove()
  }

  function editar(contato) {
    setAtualizando(true)
    setNomeAntigo(contato.chave)
    setNome(contato.nome)
    setEmail(contato.email)
    setTelefone(contato.telefone)
  }

  function atualizar() {
    const ref = database.ref("usuarios")

    const dados = {
      'nome': nome,
      'email': email,
      'telefone': telefone
    }
    ref.child(nomeAntigo).update(dados)

    setNome("")
    setEmail("")
    setTelefone("")

    setAtualizando(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.form}>
          <h2>Cadastre-se</h2>
          <form>
            <div className={styles.box}>
              <input type='text' value={nome} onChange={event => setNome(event.target.value)}/>
              <label>Nome</label>
            </div>
            <div className={styles.box}>
              <input type='email' value={email} onChange={event => setEmail(event.target.value)}/>
              <label>Email</label>
            </div>
            <div className={styles.box}>
              <input type='tel' value={telefone} onChange={event => setTelefone(event.target.value)}/>
              <label>Telefone</label>
            </div>
            {atualizando ? 
              <button className={styles.btn} onClick={atualizar} type="button">Atualizar</button> :
              <button className={styles.btn} onClick={gravar} type="button">Cadastrar</button> 
            }
          </form>
        </div>
      </div>
      <div className={styles.caixa}>
        <div className={styles.boxusers}>
          {contatos?.map((contato) => {
            return (
              <div key={contato.chave} className={styles.boxuser}>
                <div className={styles.boxtitle}>
                  <p className={styles.title}>{contato.nome}</p>
                  <div>
                    <a onClick={()=> editar(contato)} className={styles.edit}>Editar</a>
                    <a onClick={() => deletar(contato.chave)} className={styles.delete}>Deletar</a>
                  </div>
                </div>
                <div className={styles.dados}>
                  <p>{contato.email}</p>
                  <p>{contato.telefone}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}
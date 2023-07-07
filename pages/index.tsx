import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import axios, { isAxiosError } from 'axios';
import {
  Formik,
  Form,
  Field,
} from 'formik';
import * as Yup from 'yup';

import { IMaskInput } from 'react-imask';
import { VscSend } from "react-icons/vsc";
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface ISelected {
  sector: string;
}

interface MyFormValues {
  name: string;
  email: string;
  phone: string;
  current_sector: string;
  selected_sectors: string;
}

const phoneMask = [{ mask: '(00) 0000-0000' }, { mask: '(00) 00000-0000' }];

const Home: NextPage = () => {
  const [currentSector, setCurrentSector] = useState("CAPS II");
  const [selectedSectors, setSelectedSectors] = useState<ISelected[]>([]);
  const [availableSectors, setAvailableSectors] = useState(2);

  const handleInitialState = () => {
    setCurrentSector("CAPS II");
    setSelectedSectors([]);
    setAvailableSectors(2);
  }

  const currentOptions = ["CAPS II", "CAPS AD", "SRT", "OFICINA", "INTERAGIR"];
  const afterOptions = ["Selecione...", "CAPS II", "CAPS AD", "SRT"];
  const initialValues: MyFormValues = {
    name: "",
    email: "",
    phone: "",
    current_sector: "",
    selected_sectors: "",
  };

  const schema = Yup.object().shape({
    name: Yup.string().required("Campo nome é obrigatório"),
    email: Yup.string()
      .required("Campo e-mail é obrigatório")
      .email("Campo email deve ser do tipo email"),
    phone: Yup.string().required("Campo telefone é obrigatório").min(7),
    current_sector: Yup.string(),
    selected_sectors: Yup.string().min(availableSectors),
  });

  const handleCurrentSector = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    let shallow = Object.assign([], afterOptions);
    shallow.shift();
    const sector = (event.target as any).value;
    const index = shallow.indexOf(sector);
    if (index > -1) {
      shallow.splice(shallow.indexOf(sector), 1);
    }
    setAvailableSectors(shallow.length);
    setCurrentSector((event.target as any).value);
  };

  useEffect(() => {
    setSelectedSectors([] as Array<ISelected>);
  }, [currentSector]);

  const handleAfterSector = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const newSector = (event.target as any).value;
    const newSectors = [...selectedSectors, newSector];
    setSelectedSectors(newSectors);
  };

  const handleSubmit = async (values: MyFormValues, actions: any) => {
    values.current_sector = currentSector;
    values.selected_sectors = selectedSectors.toString();
    await axios.post('/api/submit', values)
      .then(function (response) {
        console.log(response);
        toast.success('Obrigado!');
        values.current_sector = '';
        values.selected_sectors = '';
        const { resetForm } = actions;
        resetForm(initialValues);
        handleInitialState();
      })
      .catch(function (error) {
        console.log(error);
        if (isAxiosError(error)) {
          toast.error(error.message);
        } else {
          toast.error(
            "Ocorreu um erro interno. Tente novamente mais tarde"
          );
        }
      });
  }
  // flex min-h-screen flex-col items-center justify-between p-24
  return (
    <main>
      <div className="min-h-screen max-w-7xl mx-auto flex  md:flex-row flex-col items-center px-5 py-24">
        <div className="lg:flex-grow md:w-1/2 md:ml-24 pt-6 flex flex-col md:items-start md:text-left mb-10 items-center text-center">
          <h1 className="mb-5 sm:text-6xl text-5xl items-center Avenir xl:w-2/2 text-gray-900 dark:text-white">
            Escolha seu time!
          </h1>
          <p className="xl:w-3/4 text-gray-600 text-lg">
            Frente a proximidade de convênio da <strong>Unidade de Internação "Interagir"</strong>, gostariamos de
            atualizar manifestação de interesse dos servidores em compor nova equipe. Solicitamos o preenchimento completo
            do formulário para que possamos mapear o desejo de a possibilidade de conciliar com o dimensionamento
            das unidades. Pedimos que preencham na ordem o desejo. Pretendemos conciliar <u>perfil x desejo</u> e a necessidade
            dos serviços.
            Na impossibilidade de contemplar o desejo do servidor, discutiremos junto ao NSDRH nova lotação.
          </p>
          <br />
          <p className='xl:w-3/4 text-gray-600 text-lg text-center'>
            Atenciosamente
            <br />
            <span className='mb-5 sm:text-3xl text-2xl items-center Avenir xl:w-2/2 text-gray-900 dark:text-white'>GAIS</span>
          </p>

        </div>
        <div className="xl:mr-44 sm:mr-0 sm:mb-28 mb-0 lg:mb-0 mr-18 md:pl-10">
          <Formik<MyFormValues>
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="w-80">
                <div className="mb-12">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Nome Completo
                  </label>
                  <Field
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id="name"
                    name="name"
                    placeholder="Digite seu nome completo"
                  />
                  {errors.name && touched.name && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    E-mail válido
                  </label>
                  <Field
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id="email"
                    name="email"
                    placeholder="Digite seu e-mail principal"
                  />
                  {errors.email && touched.email && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                      <span className="">{errors.email}</span>
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Telefone/Celular
                  </label>
                  <Field
                    name="phone"
                    id="phone"
                  >
                    {
                      ({ field }: { field: any }) => <IMaskInput
                        {...field}
                        type="text"
                        mask={phoneMask}
                        placeholder="Digite seu número de telefone/celular"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    }
                  </Field>
                  {errors.phone && touched.phone && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Unidade Atual
                  </label>
                  <select
                    onChange={handleCurrentSector}
                    name="current_sector"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    {currentOptions.map((option, index) => {
                      return (
                        <option value={option} key={index}>
                          {option}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <hr />
                <h2>Desejo compor a equipe <span className='text-red-600 text-sm'>(Escolha <strong>TODAS</strong> as equipes antes de enviar)</span></h2>
                <div className="grid gap-6 mb-6 md:grid-cols-2 pt-2">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Equipes Disponíveis
                    </label>
                    <select
                      onChange={handleAfterSector}
                      name="current_sector"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      {afterOptions.map((option, index) => {
                        if (
                          currentSector !== option &&
                          selectedSectors.indexOf(option as any) == -1
                        ) {
                          return (
                            <option value={option} key={index}>
                              {option}
                            </option>
                          );
                        }
                      })}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Opções
                    </label>
                    <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
                      {selectedSectors.map((item, index) => {
                        return (
                          <li key={index} className="pb-3 sm:pb-4">
                            <div className="flex items-center space-x-4">
                              <div className="flex-shrink-0 mt-3">
                                <div className="relative inline-flex items-center justify-center w-8 h-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                  <span className="font-medium text-gray-600 dark:text-gray-300">
                                    {(index + 1) as any}ª:{" "}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                  {item as any}
                                </p>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  {selectedSectors.length < availableSectors && (
                    <button
                      className="cursor-not-allowed text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-2 focus:outline-none 
                focus:ring-indigo-500 font-medium rounded-lg text-sm px-5 py-2.5 
                text-center inline-flex items-center dark:bg-gray-600 dark:border-gray-700 dark:text-white dark:hover:bg-gray-500 mr-2 mb-2"
                      disabled
                    >
                      <VscSend />
                      &nbsp;Enviar
                    </button>
                  )}
                  {selectedSectors.length == availableSectors && (
                    <button
                      type="submit"
                      className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-2 focus:outline-none 
                  focus:ring-indigo-500 font-medium rounded-lg text-sm px-5 py-2.5 
                  text-center inline-flex items-center dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2 mb-2"
                    >
                      <VscSend />
                      &nbsp;Enviar
                    </button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <ToastContainer />
    </main >
  )
}

export default Home;